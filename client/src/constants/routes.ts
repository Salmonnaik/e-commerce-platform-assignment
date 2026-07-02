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
  // DEMO PAYMENT MODE - Order success page
  orderSuccess: (id: string) => `/order-success/${id}`,
  profile: '/profile',
  settings: '/settings',
  tracking: (trackingNumber: string) => `/tracking/${trackingNumber}`,
  wishlist: '/wishlist',
  payments: '/payments',
  customer: {
    dashboard: '/customer',
  },
  seller: {
    dashboard: '/seller',
    analytics: '/seller/analytics',
    products: '/seller/products',
    addProduct: '/seller/products/new',
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
  ROUTES.wishlist,
  ROUTES.payments,
  ROUTES.customer.dashboard,
  ROUTES.seller.dashboard,
  ROUTES.admin.dashboard,
] as const;
