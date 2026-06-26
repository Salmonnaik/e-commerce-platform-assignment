import prisma from '../config/database';
import { COMMISSION, ESCROW, PAYOUT } from '../constants';
import {
  calculateCommission,
  calculateGatewayFee,
  calculateReturnReserve,
  calculateSellerEarnings,
  calculatePlatformEarnings,
  calculateTax,
} from '../utils/calculators';
import { addMinutes } from '../utils/date';
import logger from '../config/logger';

const ensureSellerBalance = async (sellerId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: { balance: true },
  });

  if (!seller) {
    throw new Error('Seller not found');
  }

  if (seller.balance) {
    return seller;
  }

  const balance = await prisma.sellerBalance.create({
    data: { sellerId: seller.id },
  });

  return { ...seller, balance };
};

export const createSeller = async (data: {
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  taxId?: string;
  bankAccount?: string;
  bankName?: string;
}) => {
  const seller = await prisma.seller.create({
    data: {
      ...data,
      balance: {
        create: {},
      },
    },
    include: {
      balance: true,
    },
  });

  return seller;
};

export const processSellerEarnings = async (orderId: string, totalAmount: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              seller: {
                include: {
                  balance: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const platformCommission = calculateCommission(totalAmount, COMMISSION.PLATFORM_PERCENT);
  const gatewayFee = calculateGatewayFee(totalAmount, COMMISSION.GATEWAY_FEE_PERCENT);
  const tax = calculateTax(totalAmount, COMMISSION.TAX_PERCENT);
  const logistics = 5;
  const returnReserve = calculateReturnReserve(totalAmount, COMMISSION.RETURN_RESERVE_PERCENT);
  const sellerEarnings = calculateSellerEarnings(
    totalAmount,
    platformCommission,
    gatewayFee,
    logistics,
    tax,
    returnReserve
  );

  const platformEarnings = calculatePlatformEarnings(platformCommission, gatewayFee, tax);

  for (const item of order.items) {
    const seller = await ensureSellerBalance(item.product.seller.id);
    const itemEarnings = sellerEarnings / order.items.length;
    const balance = seller.balance;

    if (!balance) {
      throw new Error('Seller balance not found');
    }

    await prisma.$transaction([
      prisma.sellerBalance.update({
        where: { id: balance.id },
        data: {
          pending: { increment: itemEarnings },
        },
      }),
      prisma.sellerLedger.create({
        data: {
          sellerId: seller.id,
          type: 'EARNINGS',
          amount: itemEarnings,
          balance: Number(balance.pending) + itemEarnings,
          description: `Order ${order.orderNumber} earnings`,
          referenceId: order.id,
        },
      }),
      prisma.escrow.create({
        data: {
          sellerId: seller.id,
          orderId: order.id,
          amount: itemEarnings,
          status: 'PENDING',
          releaseAt: addMinutes(new Date(), ESCROW.HOLD_MINUTES),
        },
      }),
    ]);

    logger.info(`Seller earnings processed: ${seller.id} - ${itemEarnings}`);
  }

  return { sellerEarnings, platformEarnings };
};

export const releaseEscrow = async () => {
  const now = new Date();
  const pendingEscrows = await prisma.escrow.findMany({
    where: {
      status: 'PENDING',
      releaseAt: { lte: now },
    },
    include: {
      seller: {
        include: {
          balance: true,
        },
      },
    },
  });

  for (const escrow of pendingEscrows) {
    const seller = await ensureSellerBalance(escrow.sellerId);
    const balance = seller.balance;

    if (!balance) {
      throw new Error('Seller balance not found');
    }

    await prisma.$transaction([
      prisma.escrow.update({
        where: { id: escrow.id },
        data: {
          status: 'AVAILABLE',
          releasedAt: now,
        },
      }),
      prisma.sellerBalance.update({
        where: { id: balance.id },
        data: {
          pending: { decrement: Number(escrow.amount) },
          available: { increment: Number(escrow.amount) },
        },
      }),
      prisma.sellerLedger.create({
        data: {
          sellerId: escrow.sellerId,
          type: 'ESCROW_RELEASE',
          amount: Number(escrow.amount),
          balance: Number(balance.available) + Number(escrow.amount),
          description: 'Escrow released to available balance',
          referenceId: escrow.id,
        },
      }),
    ]);

    logger.info(`Escrow released: ${escrow.id}`);
  }

  return { released: pendingEscrows.length };
};

export const executePayout = async (sellerId: string) => {
  const seller = await ensureSellerBalance(sellerId);
  const balance = seller.balance;

  if (!balance) {
    throw new Error('Seller balance not found');
  }

  if (Number(balance.available) <= 0) {
    throw new Error('No available balance for payout');
  }

  const amount = Number(balance.available);

  const payout = await prisma.payout.create({
    data: {
      sellerId,
      amount,
      status: 'PROCESSING',
      bankAccount: seller.bankAccount || '',
      bankName: seller.bankName || '',
    },
  });

  await prisma.sellerBalance.update({
    where: { id: balance.id },
    data: {
      available: { decrement: amount },
      locked: { increment: amount },
    },
  });

  try {
    await prisma.payout.update({
      where: { id: payout.id },
      data: {
        status: 'COMPLETED',
        referenceId: `PYT-${Date.now()}`,
      },
    });

    await prisma.sellerBalance.update({
      where: { id: balance.id },
      data: {
        locked: { decrement: amount },
        paid: { increment: amount },
      },
    });

    await prisma.sellerLedger.create({
      data: {
        sellerId,
        type: 'PAYOUT',
        amount: -amount,
        balance: Number(balance.paid) + amount,
        description: 'Payout executed',
        referenceId: payout.id,
      },
    });

    await prisma.payoutLog.create({
      data: {
        payoutId: payout.id,
        status: 'COMPLETED',
        message: 'Payout completed successfully',
      },
    });

    logger.info(`Payout completed: ${payout.id}`);
  } catch (error) {
    await prisma.payout.update({
      where: { id: payout.id },
      data: {
        status: 'FAILED',
        failureReason: 'Bank error',
        retryCount: { increment: 1 },
        nextRetryAt: addMinutes(new Date(), PAYOUT.RETRY_DELAY_MINUTES),
      },
    });

    await prisma.sellerBalance.update({
      where: { id: balance.id },
      data: {
        locked: { decrement: amount },
        available: { increment: amount },
      },
    });

    await prisma.payoutLog.create({
      data: {
        payoutId: payout.id,
        status: 'FAILED',
        message: 'Payout failed - bank error',
      },
    });

    logger.error(`Payout failed: ${payout.id}`);
  }

  return payout;
};

export const retryFailedPayouts = async () => {
  const failedPayouts = await prisma.payout.findMany({
    where: {
      status: 'FAILED',
      retryCount: { lt: 3 },
      nextRetryAt: { lte: new Date() },
    },
    include: {
      seller: true,
    },
  });

  for (const payout of failedPayouts) {
    try {
      await executePayout(payout.sellerId);
    } catch (error) {
      logger.error(`Retry payout failed: ${payout.id}`);
    }
  }

  return { retried: failedPayouts.length };
};

export const getSellerDashboard = async (sellerId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: {
      balance: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!seller) {
    throw new Error('Seller not found');
  }

  const recentOrders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            sellerId,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  const recentPayouts = await prisma.payout.findMany({
    where: { sellerId },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return {
    seller,
    productCount: seller._count.products,
    recentOrders,
    recentPayouts,
  };
};

export const getSellerProducts = async (sellerId: string, filters: {
  page: number;
  limit: number;
  status?: string;
}) => {
  const { page = 1, limit = 10, status } = filters;
  const skip = (page - 1) * limit;

  const where: any = { sellerId };

  if (status === 'active') {
    where.isActive = true;
  } else if (status === 'inactive') {
    where.isActive = false;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        inventory: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p: any) => ({
      ...p,
      salesCount: p._count.orderItems,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSellerOrders = async (sellerId: string, filters: {
  page: number;
  limit: number;
  status?: string;
}) => {
  const { page = 1, limit = 10, status } = filters;
  const skip = (page - 1) * limit;

  const where: any = {
    items: {
      some: {
        product: {
          sellerId,
        },
      },
    },
  };

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        shipment: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSellerAnalytics = async (sellerId: string, period: string = '30d') => {
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: { balance: true },
  });

  if (!seller) {
    throw new Error('Seller not found');
  }

  const startDate = new Date();
  if (period === '7d') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === '30d') {
    startDate.setDate(startDate.getDate() - 30);
  } else if (period === '90d') {
    startDate.setDate(startDate.getDate() - 90);
  } else {
    startDate.setDate(startDate.getDate() - 30);
  }

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            sellerId,
          },
        },
      },
      createdAt: {
        gte: startDate,
      },
      status: {
        in: ['PAID', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'],
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  let totalRevenue = 0;
  let totalOrders = orders.length;
  let totalItems = 0;

  for (const order of orders) {
    for (const item of order.items) {
      if (item.product.sellerId === sellerId) {
        totalRevenue += Number(item.total);
        totalItems += item.quantity;
      }
    }
  }

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const dailyRevenue: Record<string, number> = {};
  for (const order of orders) {
    const date = order.createdAt.toISOString().split('T')[0];
    if (!dailyRevenue[date]) {
      dailyRevenue[date] = 0;
    }
    for (const item of order.items) {
      if (item.product.sellerId === sellerId) {
        dailyRevenue[date] += Number(item.total);
      }
    }
  }

  const revenueChart = Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  return {
    balance: seller.balance,
    period,
    totalRevenue,
    totalOrders,
    totalItems,
    averageOrderValue,
    revenueChart,
  };
};
