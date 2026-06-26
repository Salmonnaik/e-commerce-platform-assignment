import { paymentsApi } from '../api/payments';
import type { CheckoutData, Payment } from '../types/payment';
import type { ApiResponse } from '../types/common';

export const paymentService = {
  async createCheckout(data: CheckoutData) {
    const response = await paymentsApi.createCheckout(data);
    return response.data as ApiResponse<{
      clientSecret: string;
      paymentId: string;
      orderId: string;
    }>;
  },

  async getPayment(id: string) {
    const response = await paymentsApi.getPayment(id);
    return response.data as ApiResponse<Payment>;
  },
};
