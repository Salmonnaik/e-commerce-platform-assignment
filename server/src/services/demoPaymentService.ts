/**
 * DEMO PAYMENT MODE - Development Only
 * Generates realistic mock payment data for testing without Stripe integration
 */

import { v4 as uuidv4 } from 'uuid';

interface DemoPaymentData {
  orderId: string;
  paymentId: string;
  trackingId: string;
  invoiceNumber: string;
  estimatedDelivery: string;
  paymentStatus: 'COMPLETED';
  orderStatus: 'CONFIRMED';
  stripePaymentIntentId: string;
}

/**
 * DEMO PAYMENT MODE - Generate realistic Order ID
 * Format: ORD-YYYYMMDD-0001
 */
function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `ORD-${year}${month}${day}-${sequence}`;
}

/**
 * DEMO PAYMENT MODE - Generate realistic Tracking ID
 * Format: TRKXXXXXXXX (8 random uppercase letters/numbers)
 */
function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let trackingId = 'TRK';
  for (let i = 0; i < 8; i++) {
    trackingId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return trackingId;
}

/**
 * DEMO PAYMENT MODE - Generate realistic Payment ID
 * Format: PAYXXXXXXXXXX
 */
function generatePaymentId(): string {
  return `PAY${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
}

/**
 * DEMO PAYMENT MODE - Generate realistic Invoice Number
 * Format: INV-YYYYMMDD-0001
 */
function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `INV-${year}${month}${day}-${sequence}`;
}

/**
 * DEMO PAYMENT MODE - Calculate estimated delivery (3-5 business days)
 */
function calculateEstimatedDelivery(): string {
  const today = new Date();
  // Add 3-5 business days
  const deliveryDays = Math.floor(Math.random() * 3) + 3; // 3-5 days
  const deliveryDate = new Date(today);
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return deliveryDate.toLocaleDateString('en-US', options);
}

/**
 * DEMO PAYMENT MODE - Simulate Stripe PaymentIntent ID
 * Format: pi_XXXXXXXXXXXXXXXX
 */
function generateStripePaymentIntentId(): string {
  return `pi_${uuidv4().replace(/-/g, '').substring(0, 20).toLowerCase()}`;
}

/**
 * DEMO PAYMENT MODE - Generate complete demo payment data
 * All IDs are unique for each order
 */
export function generateDemoPaymentData(): DemoPaymentData {
  return {
    orderId: generateOrderId(),
    paymentId: generatePaymentId(),
    trackingId: generateTrackingId(),
    invoiceNumber: generateInvoiceNumber(),
    estimatedDelivery: calculateEstimatedDelivery(),
    paymentStatus: 'COMPLETED',
    orderStatus: 'CONFIRMED',
    stripePaymentIntentId: generateStripePaymentIntentId(),
  };
}

/**
 * DEMO PAYMENT MODE - Simulate payment processing delay
 * Returns a promise that resolves after 2 seconds
 */
export async function simulatePaymentProcessing(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}
