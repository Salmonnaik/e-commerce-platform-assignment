import { adminApi } from '../api/admin';
import type { ApiResponse } from '../types/common';

export const adminService = {
  async getDashboard() {
    const response = await adminApi.getDashboard();
    return response.data;
  },

  async getUsers(params?: { role?: string; page?: number; limit?: number }) {
    const response = await adminApi.getUsers(params);
    return response.data;
  },

  async getSellers(params?: { isVerified?: boolean; page?: number; limit?: number }) {
    const response = await adminApi.getSellers(params);
    return response.data;
  },

  async verifySeller(id: string) {
    const response = await adminApi.verifySeller(id);
    return response.data as ApiResponse<unknown>;
  },

  async getAllOrders(params?: { status?: string; page?: number; limit?: number }) {
    const response = await adminApi.getAllOrders(params);
    return response.data;
  },

  async getAnalytics(params?: { period?: string }) {
    const response = await adminApi.getAnalytics(params);
    return response.data;
  },

  async updateOrderStatus(id: string, status: string, notes?: string) {
    const response = await adminApi.updateOrderStatus(id, { status, notes });
    return response.data;
  },
};
