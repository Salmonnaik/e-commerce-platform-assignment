import { useCallback } from 'react';
import { useOrderStore } from '../store/orderStore';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../utils/helpers';

export function useOrders() {
  const {
    orders,
    selectedOrder,
    totalPages,
    loading,
    setOrders,
    setSelectedOrder,
    setLoading,
    updateOrderInList,
  } = useOrderStore();

  const fetchOrders = useCallback(
    async (params?: { status?: string; page?: number; limit?: number }) => {
      setLoading(true);
      try {
        const response = await orderService.getOrders(params);
        setOrders(response.data.orders, response.data.pagination.totalPages);
      } catch (error) {
        console.error(getErrorMessage(error, 'Failed to fetch orders'));
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setOrders]
  );

  const fetchOrder = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await orderService.getOrder(id);
        setSelectedOrder(response.data);
        return response.data;
      } catch (error) {
        console.error(getErrorMessage(error, 'Failed to fetch order'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setSelectedOrder]
  );

  const cancelOrder = useCallback(
    async (id: string) => {
      try {
        const response = await orderService.cancelOrder(id);
        updateOrderInList(response.data);
        return response.data;
      } catch (error) {
        console.error(getErrorMessage(error, 'Failed to cancel order'));
        throw error;
      }
    },
    [updateOrderInList]
  );

  return {
    orders,
    selectedOrder,
    totalPages,
    loading,
    fetchOrders,
    fetchOrder,
    cancelOrder,
  };
}
