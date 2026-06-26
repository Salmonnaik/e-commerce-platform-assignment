import { ordersApi } from '../api/orders';
import type { CreateOrderData, Order } from '../types/order';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export const orderService = {
  async createOrder(data: CreateOrderData) {
    const response = await ordersApi.createOrder(data);
    return response.data as ApiResponse<Order>;
  },

  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const response = await ordersApi.getOrders(params);
    return response.data as ApiResponse<{
      orders: Order[];
      pagination: PaginatedResponse<Order>['pagination'];
    }>;
  },

  async getOrder(id: string) {
    const response = await ordersApi.getOrder(id);
    return response.data as ApiResponse<Order>;
  },

  async cancelOrder(id: string) {
    const response = await ordersApi.cancelOrder(id);
    return response.data as ApiResponse<Order>;
  },

  async getOrderInvoice(id: string) {
    const response = await ordersApi.getOrderInvoice(id);
    return response.data;
  },
};
