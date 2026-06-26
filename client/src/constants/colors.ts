import type { OrderStatus } from '../types/order';
import type { PaymentStatus } from '../types/payment';
import type { ShipmentStatus } from '../types/logistics';

export const STATUS_COLORS = {
  success: 'text-green-600 bg-green-100',
  warning: 'text-yellow-600 bg-yellow-100',
  error: 'text-red-600 bg-red-100',
  info: 'text-blue-600 bg-blue-100',
  neutral: 'text-gray-600 bg-gray-100',
} as const;

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: STATUS_COLORS.warning,
  PAID: STATUS_COLORS.info,
  PROCESSING: STATUS_COLORS.info,
  SHIPPED: STATUS_COLORS.info,
  OUT_FOR_DELIVERY: STATUS_COLORS.info,
  DELIVERED: STATUS_COLORS.success,
  CANCELLED: STATUS_COLORS.neutral,
  RETURNED: STATUS_COLORS.warning,
  FAILED: STATUS_COLORS.error,
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: STATUS_COLORS.warning,
  PROCESSING: STATUS_COLORS.info,
  COMPLETED: STATUS_COLORS.success,
  FAILED: STATUS_COLORS.error,
  REFUNDED: STATUS_COLORS.neutral,
};

export const SHIPMENT_STATUS_COLORS: Record<ShipmentStatus, string> = {
  PENDING: STATUS_COLORS.warning,
  PICKED_UP: STATUS_COLORS.info,
  IN_TRANSIT: STATUS_COLORS.info,
  OUT_FOR_DELIVERY: STATUS_COLORS.info,
  DELIVERED: STATUS_COLORS.success,
  FAILED: STATUS_COLORS.error,
  RETURNED: STATUS_COLORS.warning,
};

export const THEME_COLORS = {
  primary: '#0284c7',
  secondary: '#64748b',
  accent: '#0ea5e9',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textMuted: '#64748b',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
} as const;
