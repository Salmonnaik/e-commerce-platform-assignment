import api from './axios';

export const paymentsApi = {
  createCheckout: (data: {
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
  }) =>
    api.post('/v1/payments/checkout', data),
  
  getPayment: (id: string) =>
    api.get(`/v1/payments/${id}`),
};
