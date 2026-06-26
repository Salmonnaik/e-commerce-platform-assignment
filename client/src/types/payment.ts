export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface CheckoutData {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddressId?: string;
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
  couponCode?: string;
}

export interface CheckoutSession {
  clientSecret: string;
  paymentId: string;
  orderId: string;
}
