export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    profile: '/auth/profile',
  },
  products: {
    list: '/v1/products',
    detail: (id: string) => `/v1/products/${id}`,
    search: '/v1/products/search',
    inventory: (id: string) => `/v1/products/${id}/inventory`,
  },
  categories: {
    list: '/v1/categories',
    detail: (id: string) => `/v1/categories/${id}`,
  },
  orders: {
    list: '/v1/orders',
    detail: (id: string) => `/v1/orders/${id}`,
    cancel: (id: string) => `/v1/orders/${id}/cancel`,
    invoice: (id: string) => `/v1/orders/${id}/invoice`,
  },
  payments: {
    checkout: '/v1/payments/checkout',
    detail: (id: string) => `/v1/payments/${id}`,
  },
  logistics: {
    tracking: (trackingNumber: string) => `/v1/logistics/tracking/${trackingNumber}`,
    orderShipment: (orderId: string) => `/v1/logistics/orders/${orderId}/shipment`,
    trackingHistory: (trackingNumber: string) =>
      `/v1/logistics/tracking/${trackingNumber}/history`,
  },
  sellers: {
    profile: '/v1/sellers/profile',
    products: '/v1/sellers/products',
    orders: '/v1/sellers/orders',
    balance: '/v1/sellers/balance',
    ledger: '/v1/sellers/ledger',
    payouts: '/v1/sellers/payouts',
    analytics: '/v1/sellers/analytics',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    sellers: '/admin/sellers',
    verifySeller: (id: string) => `/admin/sellers/${id}/verify`,
    orders: '/admin/orders',
    analytics: '/admin/analytics',
    orderStatus: (id: string) => `/admin/orders/${id}/status`,
  },
  uploads: '/v1/uploads',
} as const;

export const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
  cart: 'cart',
  theme: 'theme',
  settings: 'userSettings',
} as const;

export const DEFAULT_PAGE_SIZE = 12;
