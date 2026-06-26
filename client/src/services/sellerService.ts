import { sellersApi } from '../api/sellers';
import type { LedgerEntry, Seller, SellerAnalytics, SellerBalance, SellerPayout } from '../types/seller';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export const sellerService = {
  async getProfile() {
    const response = await sellersApi.getSellerProfile();
    return response.data as ApiResponse<Seller>;
  },

  async updateProfile(data: Partial<Seller>) {
    const response = await sellersApi.updateSellerProfile(data);
    return response.data as ApiResponse<Seller>;
  },

  async getProducts(params?: { page?: number; limit?: number }) {
    const response = await sellersApi.getSellerProducts(params);
    return response.data;
  },

  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const response = await sellersApi.getSellerOrders(params);
    return response.data;
  },

  async getBalance() {
    const response = await sellersApi.getSellerBalance();
    return response.data as ApiResponse<SellerBalance>;
  },

  async getLedger(params?: { page?: number; limit?: number }) {
    const response = await sellersApi.getSellerLedger(params);
    return response.data as ApiResponse<{
      entries: LedgerEntry[];
      pagination: PaginatedResponse<LedgerEntry>['pagination'];
    }>;
  },

  async getPayouts(params?: { status?: string; page?: number; limit?: number }) {
    const response = await sellersApi.getSellerPayouts(params);
    return response.data as ApiResponse<{
      payouts: SellerPayout[];
      pagination: PaginatedResponse<SellerPayout>['pagination'];
    }>;
  },

  async requestPayout(amount: number) {
    const response = await sellersApi.requestPayout({ amount });
    return response.data as ApiResponse<SellerPayout>;
  },

  async getAnalytics(period?: string) {
    const response = await sellersApi.getSellerAnalytics(period);
    return response.data as ApiResponse<SellerAnalytics>;
  },
};
