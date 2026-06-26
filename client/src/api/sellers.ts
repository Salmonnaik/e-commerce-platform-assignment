import api from './axios';

export const sellersApi = {
  getSellerProfile: () => api.get('/v1/sellers/profile'),
  
  updateSellerProfile: (data: {
    businessName?: string;
    businessEmail?: string;
    businessPhone?: string;
    taxId?: string;
    bankAccount?: string;
    bankName?: string;
  }) => api.put('/v1/sellers/profile', data),
  
  getSellerProducts: (params?: {
    page?: number;
    limit?: number;
  }) => api.get('/v1/sellers/products', { params }),
  
  getSellerOrders: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/v1/sellers/orders', { params }),
  
  getSellerBalance: () => api.get('/v1/sellers/balance'),
  
  getSellerLedger: (params?: {
    page?: number;
    limit?: number;
  }) => api.get('/v1/sellers/ledger', { params }),
  
  getSellerPayouts: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/v1/sellers/payouts', { params }),
  
  requestPayout: (data: {
    amount: number;
  }) => api.post('/v1/sellers/payouts', data),

  getSellerAnalytics: (period?: string) => api.get('/v1/sellers/analytics', { params: { period } }),
};
