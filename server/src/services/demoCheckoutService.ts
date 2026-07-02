/**
 * DEMO PAYMENT MODE - Development Only
 * Simulates complete checkout flow without calling Stripe
 */

import prisma from '../config/database';
import { generateDemoPaymentData, simulatePaymentProcessing } from './demoPaymentService';
import { bookShipment } from './shippingService';
import { processSellerEarnings } from './sellerService';
import { queueEmail } from './emailService';
import { COMMISSION } from '../constants';
import { calculateTax } from '../utils/calculators';
import logger from '../config/logger';

export const createDemoCheckout = async (data: {
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
  // DEMO PAYMENT MODE - Retrieve demo data
  const demoData = generateDemoPaymentData();

  const { userId, items, shippingAddress } = data;

  // DEMO PAYMENT MODE - Validate products exist
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { seller: true, inventory: true },
  });

  if (products.length !== items.length) {
    throw new Error('Some products are not available');
  }

  let subtotal = 0;
  const orderItems = items.map((item) => {
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

  // DEMO PAYMENT MODE - Create order with demo payment data
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        // DEMO PAYMENT MODE - Use realistic demo order number
        orderNumber: demoData.orderId,
        status: demoData.orderStatus,
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
            // DEMO PAYMENT MODE - Use demo Stripe payment intent ID
            paymentIntentId: demoData.stripePaymentIntentId,
            amount: total,
            // DEMO PAYMENT MODE - Mark as completed for demo
            status: demoData.paymentStatus,
            // DEMO PAYMENT MODE - Use demo payment ID
            clientSecret: demoData.paymentId,
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
        items: { include: { product: true } },
        payment: true,
        shippingAddress: true,
      },
    });

    // DEMO PAYMENT MODE - Deduct inventory
    for (const item of items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: { decrement: item.quantity },
          available: { decrement: item.quantity },
        },
      });
    }

    return createdOrder;
  });

  logger.info(`[DEMO PAYMENT] Order created: ${demoData.orderId}`, {
    orderId: demoData.orderId,
    paymentId: demoData.paymentId,
    trackingId: demoData.trackingId,
  });

  // DEMO PAYMENT MODE - Simulate payment processing delay (2 seconds)
  await simulatePaymentProcessing();

  // DEMO PAYMENT MODE - Mark order as paid after "processing"
  const confirmedOrder = await prisma.$transaction(async (tx) => {
    // Update payment to completed
    const payment = await tx.payment.findUnique({
      where: { orderId: order.id },
    });
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' },
    });

    // Update order to PAID
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
      include: { items: { include: { product: true } }, payment: true, shippingAddress: true },
    });

    // DEMO PAYMENT MODE - Process seller earnings
    await processSellerEarnings(updatedOrder.id, updatedOrder.total);

    // DEMO PAYMENT MODE - Finalize inventory
    for (const item of items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          reserved: { decrement: item.quantity },
        },
      });
    }

    // DEMO PAYMENT MODE - Create mock shipment data (don't call Shiprocket)
    if (updatedOrder.shippingAddress) {
      await tx.shipment.create({
        data: {
          orderId: updatedOrder.id,
          shippingAddressId: updatedOrder.shippingAddress.id,
          // DEMO PAYMENT MODE - Use demo tracking ID
          trackingNumber: demoData.trackingId,
          carrier: 'DEMO-SHIPROCKET',
          status: 'CONFIRMED',
          estimatedDelivery: demoData.estimatedDelivery,
        },
      });
    }

    return updatedOrder;
  });

  // DEMO PAYMENT MODE - Send confirmation email
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await queueEmail({
      to: user.email,
      subject: '[DEMO] Order Confirmed - ' + demoData.orderId,
      template: 'order-confirmation',
      data: {
        orderNumber: demoData.orderId,
        trackingId: demoData.trackingId,
        invoiceNumber: demoData.invoiceNumber,
        total: confirmedOrder.total,
        isDemoMode: true,
      },
    });
  }

  logger.info(`[DEMO PAYMENT] Order confirmed and paid: ${demoData.orderId}`);

  return {
    // DEMO PAYMENT MODE - Return demo payment data alongside order
    order: confirmedOrder,
    demoData,
    clientSecret: demoData.paymentId,
    paymentIntentId: demoData.stripePaymentIntentId,
    isDemoPayment: true,
  };
};

/**
 * DEMO PAYMENT MODE - Retrieve order details with demo payment info
 */
export const getDemoOrderDetails = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      payment: true,
      shippingAddress: true,
      shipment: true,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // DEMO PAYMENT MODE - Return with demo metadata
  return {
    order,
    isDemoOrder: order.payment[0]?.status === 'COMPLETED' && order.status === 'PAID',
  };
};
