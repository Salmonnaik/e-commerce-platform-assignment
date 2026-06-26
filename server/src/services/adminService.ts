import prisma from '../config/database';

export const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalSellers,
    totalProducts,
    totalOrders,
    totalPayments,
    totalShipments,
    recentOrders,
    recentSellers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.payment.count(),
    prisma.shipment.count(),
    prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
    prisma.seller.findMany({
      include: {
        balance: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    }),
  ]);

  const totalRevenue = await prisma.payment.aggregate({
    where: {
      status: 'COMPLETED',
    },
    _sum: {
      amount: true,
    },
  });

  return {
    stats: {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalPayments,
      totalShipments,
      totalRevenue: Number(totalRevenue._sum.amount || 0),
    },
    recentOrders,
    recentSellers,
  };
};

export const getAllUsers = async (filters: {
  role?: string;
  page: number;
  limit: number;
}) => {
  const { role, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (role) {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map((u: any) => ({
      ...u,
      orderCount: u._count.orders,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllSellers = async (filters: {
  status?: string;
  page: number;
  limit: number;
}) => {
  const { status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status === 'active') {
    where.isActive = true;
  } else if (status === 'inactive') {
    where.isActive = false;
  } else if (status === 'verified') {
    where.isVerified = true;
  }

  const [sellers, total] = await Promise.all([
    prisma.seller.findMany({
      where,
      include: {
        balance: true,
        user: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.seller.count({ where }),
  ]);

  return {
    sellers: sellers.map((s: any) => ({
      ...s,
      productCount: s._count.products,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllOrders = async (filters: {
  status?: string;
  page: number;
  limit: number;
}) => {
  const { status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        shipment: true,
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

export const getAllProducts = async (filters: {
  status?: string;
  categoryId?: string;
  page: number;
  limit: number;
}) => {
  const { status, categoryId, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status === 'active') {
    where.isActive = true;
  } else if (status === 'inactive') {
    where.isActive = false;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: true,
        inventory: true,
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
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllPayments = async (filters: {
  status?: string;
  page: number;
  limit: number;
}) => {
  const { status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllShipments = async (filters: {
  status?: string;
  page: number;
  limit: number;
}) => {
  const { status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where,
      include: {
        order: {
          include: {
            user: true,
          },
        },
        trackingHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.shipment.count({ where }),
  ]);

  return {
    shipments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAdminAnalytics = async (period: string = '30d') => {
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

  const [orders, payments, newUsers, newSellers] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
      },
    }),
    prisma.payment.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED',
      },
    }),
    prisma.user.findMany({
      where: {
        createdAt: { gte: startDate },
      },
    }),
    prisma.seller.findMany({
      where: {
        createdAt: { gte: startDate },
      },
    }),
  ]);

  const totalRevenue = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const ordersByStatus: Record<string, number> = {};
  for (const order of orders) {
    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
  }

  const dailyOrders: Record<string, number> = {};
  const dailyRevenue: Record<string, number> = {};

  for (const order of orders) {
    const date = order.createdAt.toISOString().split('T')[0];
    dailyOrders[date] = (dailyOrders[date] || 0) + 1;
  }

  for (const payment of payments) {
    const date = payment.createdAt.toISOString().split('T')[0];
    dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(payment.amount);
  }

  const ordersChart = Object.entries(dailyOrders).map(([date, count]) => ({ date, count }));
  const revenueChart = Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue }));

  return {
    period,
    totalRevenue,
    totalOrders,
    averageOrderValue,
    newUsers: newUsers.length,
    newSellers: newSellers.length,
    ordersByStatus,
    ordersChart,
    revenueChart,
  };
};

export const getRevenueReport = async (startDate?: string, endDate?: string) => {
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const payments = await prisma.payment.findMany({
    where: {
      status: 'COMPLETED',
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    include: {
      order: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let totalRevenue = 0;
  let platformRevenue = 0;
  const sellerRevenue: Record<string, number> = {};

  for (const payment of payments) {
    totalRevenue += Number(payment.amount);
    const order = payment.order;

    for (const item of order.items) {
      const sellerId = item.product.sellerId;
      const itemRevenue = Number(item.total);
      const platformCommission = itemRevenue * 0.12;
      const sellerEarnings = itemRevenue - platformCommission;

      platformRevenue += platformCommission;
      sellerRevenue[sellerId] = (sellerRevenue[sellerId] || 0) + sellerEarnings;
    }
  }

  const sellerBreakdown = await Promise.all(
    Object.entries(sellerRevenue).map(async ([sellerId, revenue]) => {
      const seller = await prisma.seller.findUnique({
        where: { id: sellerId },
        include: { user: true },
      });
      return {
        sellerId,
        sellerName: seller?.businessName || seller?.user.name,
        revenue,
      };
    })
  );

  return {
    startDate: start,
    endDate: end,
    totalRevenue,
    platformRevenue,
    sellerRevenue: totalRevenue - platformRevenue,
    sellerBreakdown,
    transactionCount: payments.length,
  };
};
