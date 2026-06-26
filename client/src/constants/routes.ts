export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  products: '/products',
  productDetail: (id: string) => `/products/${id}`,
  categories: '/categories',
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  orderDetail: (id: string) => `/orders/${id}`,
  profile: '/profile',
  settings: '/settings',
  tracking: (trackingNumber: string) => `/tracking/${trackingNumber}`,
  seller: {
    dashboard: '/seller',
    analytics: '/seller/analytics',
  },
  admin: {
    dashboard: '/admin',
  },
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.register,
  ROUTES.products,
  ROUTES.categories,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.cart,
  ROUTES.checkout,
  ROUTES.orders,
  ROUTES.profile,
  ROUTES.settings,
] as const;
