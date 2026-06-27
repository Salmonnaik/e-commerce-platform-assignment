export const COMMISSION = {
  PLATFORM_PERCENT: parseFloat(process.env.PLATFORM_COMMISSION_PERCENT || '12'),
  GATEWAY_FEE_PERCENT: parseFloat(process.env.GATEWAY_FEE_PERCENT || '2.5'),
  RETURN_RESERVE_PERCENT: parseFloat(process.env.RETURN_RESERVE_PERCENT || '1'),
  TAX_PERCENT: parseFloat(process.env.TAX_PERCENT || '2'),
};

export const ESCROW = {
  HOLD_MINUTES: parseInt(process.env.ESCROW_HOLD_MINUTES || '3'),
};

export const PAYOUT = {
  RETRY_LIMIT: parseInt(process.env.PAYOUT_RETRY_LIMIT || '3'),
  RETRY_DELAY_MINUTES: parseInt(process.env.PAYOUT_RETRY_DELAY_MINUTES || '5'),
};

export const STRIPE = {
  SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
};

export const SHIPROCKET = {
  EMAIL: process.env.SHIPROCKET_EMAIL || '',
  PASSWORD: process.env.SHIPROCKET_PASSWORD || '',
  API_URL: process.env.SHIPROCKET_API_URL || 'https://apiv2.shiprocket.in/v1/external',
};

export const JWT = {
  SECRET: process.env.JWT_SECRET || 'development-secret',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

export const FIREBASE = {
  PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
};

export const SERVER = {
  PORT: parseInt(process.env.PORT || '5000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
