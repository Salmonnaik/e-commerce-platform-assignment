export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  taxId?: string;
  isVerified: boolean;
  bankAccount?: string;
  bankName?: string;
}

export interface SellerBalance {
  available: number;
  pending: number;
  locked: number;
  total: number;
}

export interface SellerPayout {
  id: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
}

export interface SellerAnalytics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingPayouts: number;
  revenueByPeriod?: Array<{ date: string; revenue: number }>;
}

export interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}
