import prisma from '../config/database';
import { generateOrderNumber } from '../utils/uuid';
import logger from '../config/logger';

export const createOrder = async (userId: string, data: {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddressId: string;
  couponCode?: string;
}) => {
  const { items, shippingAddressId } = data;

  const productIds = items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { seller: true, inventory: true },
  });

  if (products.length !== items.length) {
    throw new Error('Some products are not available');
  }

  // Check inventory
  for (const item of items) {
    const product = products.find((p: any) => p.id === item.productId);
    if (!product || (product.inventory?.available || 0) < item.quantity) {
      throw new Error(`Insufficient stock for ${product?.name}`);
    }
  }

  let subtotal = 0;
  const orderItems = items.map(item => {
    const product = products.find((p: any) => p.id === item.productId);
    if (!product) throw new Error('Product not found');

    const itemTotal = Number(product.price) * item.quantity;
    subtotal += itemTotal;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
      total: itemTotal,
    };
  });

  const tax = subtotal * 0.02;
  const shipping = 5;
  const discount = 0;
  const total = subtotal + tax + shipping - discount;

  const order = await prisma.$transaction(async (tx: any) => {
    const order = await tx.order.create({
      data: {
        userId,
        orderNumber: generateOrderNumber(),
        status: 'PENDING',
        subtotal,
        tax,
        shipping,
        discount,
        total,
        items: {
          create: orderItems,
        },
        shippingAddress: {
          connect: { id: shippingAddressId },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    // Reserve inventory
    for (const item of items) {
      const product = products.find((p: any) => p.id === item.productId);
      if (product?.inventory) {
        await tx.inventory.update({
          where: { id: product.inventory.id },
          data: {
            reserved: { increment: item.quantity },
            available: { decrement: item.quantity },
          },
        });
      }
    }

    return order;
  });

  logger.info(`Order created: ${order.id}`);
  return order;
};

export const getCustomerOrders = async (userId: string, filters: {
  status?: string;
  page: number;
  limit: number;
}) => {
  const { status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: any = { userId };

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

export const getOrderById = async (id: string, userId: string, userRole: string) => {
  const where: any = { id };

  if (userRole !== 'ADMIN') {
    where.userId = userId;
  }

  const order = await prisma.order.findUnique({
    where,
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
      payment: true,
      shipment: {
        include: {
          trackingHistory: true,
        },
      },
      shippingAddress: true,
      user: true,
    },
  });

  return order;
};

export const cancelOrder = async (id: string, userId: string, userRole: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              inventory: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (userRole !== 'ADMIN' && order.userId !== userId) {
    throw new Error('Unauthorized to cancel this order');
  }

  if (!['PENDING', 'PAID'].includes(order.status)) {
    throw new Error('Order cannot be cancelled at this stage');
  }

  await prisma.$transaction(async (tx: any) => {
    // Release inventory
    for (const item of order.items) {
      if (item.product.inventory) {
        await tx.inventory.update({
          where: { id: item.product.inventory.id },
          data: {
            reserved: { decrement: item.quantity },
            available: { increment: item.quantity },
          },
        });
      }
    }

    // Update order status
    await tx.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // If paid, initiate refund
    if (order.payment && order.payment.status === 'COMPLETED') {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: { status: 'REFUNDED' },
      });
    }
  });

  logger.info(`Order cancelled: ${id}`);
  return { id, status: 'CANCELLED' };
};

export const getOrderInvoice = async (id: string, userId: string, userRole: string) => {
  const order = await getOrderById(id, userId, userRole);

  if (!order) {
    throw new Error('Order not found');
  }

  return {
    orderNumber: order.orderNumber,
    orderDate: order.createdAt,
    customer: {
      name: order.user.name,
      email: order.user.email,
    },
    shippingAddress: order.shippingAddress,
    items: order.items.map((item: any) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.price),
      total: Number(item.total),
    })),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shipping: Number(order.shipping),
    discount: Number(order.discount),
    total: Number(order.total),
    payment: order.payment ? {
      method: 'Stripe',
      status: order.payment.status,
      amount: Number(order.payment.amount),
    } : null,
  };
};
