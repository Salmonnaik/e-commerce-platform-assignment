import api from './axios';

export const ordersApi = {
  createOrder: (data: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddressId: string;
    couponCode?: string;
  }) => api.post('/v1/orders', data),
  
  getOrders: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/v1/orders', { params }),
  
  getOrder: (id: string) => api.get(`/v1/orders/${id}`),
  
  cancelOrder: (id: string) => api.post(`/v1/orders/${id}/cancel`),
  
  getOrderInvoice: (id: string) => api.get(`/v1/orders/${id}/invoice`),
};
