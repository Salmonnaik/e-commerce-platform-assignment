import type { PaymentStatus } from '../types/payment';

export const PAYMENT_STATUS: Record<PaymentStatus, PaymentStatus> = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export const TAX_RATE = 0.02;
export const DEFAULT_SHIPPING_FEE = 5;
export const PLATFORM_COMMISSION_PERCENT = 12;
export const GATEWAY_FEE_PERCENT = 2.5;

export const STRIPE_CURRENCY = 'usd';
