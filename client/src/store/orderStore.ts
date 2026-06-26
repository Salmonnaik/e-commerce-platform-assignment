import { create } from 'zustand';
import type { Order } from '../types/order';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  totalPages: number;
  loading: boolean;
  setOrders: (orders: Order[], totalPages: number) => void;
  setSelectedOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  updateOrderInList: (order: Order) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  totalPages: 1,
  loading: false,

  setOrders: (orders, totalPages) => set({ orders, totalPages }),
  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
  setLoading: (loading) => set({ loading }),
  updateOrderInList: (order) =>
    set((state) => ({
      orders: state.orders.map((item) => (item.id === order.id ? order : item)),
      selectedOrder:
        state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    })),
}));
