import prisma from '../config/database';
import { createPaymentIntent, refundPayment as stripeRefundPayment } from './stripeService';
import { bookShipment } from './shippingService';
import { processSellerEarnings } from './sellerService';
import { queueEmail } from './emailService';
import { COMMISSION } from '../constants';
import { calculateTax } from '../utils/calculators';
import logger from '../config/logger';

export const createCheckout = async (data: {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  idempotencyKey?: string;
}) => {
  const { userId, items, shippingAddress, idempotencyKey } = data;

  const productIds = items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { seller: true, inventory: true },
  });

  if (products.length !== items.length) {
    throw new Error('Some products are not available');
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

  const tax = calculateTax(subtotal, COMMISSION.TAX_PERCENT);
  const shipping = 5;
  const discount = 0;
  const total = subtotal + tax + shipping - discount;

  const { clientSecret, paymentIntentId } = await createPaymentIntent(total, 'usd', idempotencyKey);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        orderNumber: `ORD-${Date.now()}`,
        status: 'PENDING',
        subtotal,
        tax,
        shipping,
        discount,
        total,
        items: {
          create: orderItems,
        },
        payment: {
          create: {
            paymentIntentId,
            amount: total,
            status: 'PENDING',
            clientSecret,
          },
        },
        ...(shippingAddress && {
          shippingAddress: {
            create: {
              userId,
              fullName: shippingAddress.fullName,
              addressLine1: shippingAddress.addressLine1,
              addressLine2: shippingAddress.addressLine2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postalCode: shippingAddress.postalCode,
              country: shippingAddress.country,
              phone: shippingAddress.phone,
            },
          },
        }),
      },
      include: {
        items: true,
        payment: true,
        shippingAddress: true,
      },
    });

    for (const item of orderItems) {
      const product = products.find((p: any) => p.id === item.productId);

      if (!product) {
        throw new Error('Product not found during inventory reservation');
      }

      if (product.inventory) {
        await tx.inventory.update({
          where: { id: product.inventory.id },
          data: {
            reserved: { increment: item.quantity },
            available: { decrement: item.quantity },
          },
        });
      }
    }

    return createdOrder;
  });

  return {
    clientSecret,
    paymentIntentId,
    order,
  };
};

export const handlePaymentSuccess = async (paymentIntentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { paymentIntentId },
    include: {
      order: {
        include: {
          items: {
            include: {
              product: {
                include: { inventory: true },
              },
            },
          },
          user: true,
          shippingAddress: true,
        },
      },
    },
  });

  if (!payment || !payment.order) {
    throw new Error('Payment or order not found');
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: 'PAID' },
    });

    for (const item of payment.order.items) {
      const inventory = item.product?.inventory;
      if (!inventory) continue;

      await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: { decrement: item.quantity },
          reserved: { decrement: item.quantity },
        },
      });
    }
  });

  await processSellerEarnings(payment.orderId, Number(payment.amount));

  try {
    await bookShipment(payment.orderId);
  } catch (error) {
    logger.error(`Shipment booking failed after payment success: ${error}`);
  }

  await queueEmail(
    payment.order.user.email,
    `Payment Successful - ${payment.order.orderNumber}`,
    `<p>Your payment for order <strong>${payment.order.orderNumber}</strong> was successful. We are preparing your shipment.</p>`,
    {}
  );

  logger.info(`Payment succeeded: ${paymentIntentId}`);
  return payment;
};

export const handlePaymentFailure = async (paymentIntentId: string, errorMessage: string) => {
  const payment = await prisma.payment.findUnique({
    where: { paymentIntentId },
    include: {
      order: {
        include: {
          items: {
            include: {
              product: {
                include: { inventory: true },
              },
            },
          },
          user: true,
          shippingAddress: true,
        },
      },
    },
  });

  if (!payment || !payment.order) {
    throw new Error('Payment not found');
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    for (const item of payment.order.items) {
      const inventory = item.product?.inventory;
      if (!inventory) continue;

      await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          reserved: { decrement: item.quantity },
          available: { increment: item.quantity },
        },
      });
    }

    await tx.paymentLog.create({
      data: {
        paymentId: payment.id,
        event: 'payment_failed',
        status: 'FAILED',
        message: errorMessage,
      },
    });
  });

  await queueEmail(
    payment.order.user.email,
    `Payment Failed - ${payment.order.orderNumber}`,
    `<p>Your payment for order <strong>${payment.order.orderNumber}</strong> failed.</p><p>Reason: ${errorMessage}</p><p>Please try again or contact support.</p>`,
    {}
  );

  logger.error(`Payment failed: ${paymentIntentId} - ${errorMessage}`);
};

export const refundPayment = async (paymentId: string, amount?: number) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { order: true },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'COMPLETED') {
    throw new Error('Payment cannot be refunded');
  }

  const refund = await stripeRefundPayment(payment.paymentIntentId, amount);

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' },
    }),
    prisma.paymentLog.create({
      data: {
        paymentId: payment.id,
        event: 'refund_processed',
        status: 'REFUNDED',
        message: `Refunded ${refund.amount}`,
        metadata: { refundId: refund.refundId },
      },
    }),
  ]);

  logger.info(`Payment refunded: ${paymentId} - ${refund.refundId}`);
  return refund;
};
