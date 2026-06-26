import api from './axios';

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  getUsers: (params?: {
    role?: string;
    page?: number;
    limit?: number;
  }) => api.get('/admin/users', { params }),
  
  getSellers: (params?: {
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/admin/sellers', { params }),
  
  verifySeller: (id: string) => api.post(`/admin/sellers/${id}/verify`),
  
  getAllOrders: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/admin/orders', { params }),
  
  getAnalytics: (params?: {
    period?: string;
  }) => api.get('/admin/analytics', { params }),
  
  updateOrderStatus: (id: string, data: {
    status: string;
    notes?: string;
  }) => api.put(`/admin/orders/${id}/status`, data),
};
