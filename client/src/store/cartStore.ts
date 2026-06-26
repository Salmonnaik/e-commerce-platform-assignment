import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/api';
import { getStorageItem, setStorageItem } from '../utils/storage';
import type { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function persistCart(items: CartItem[]) {
  setStorageItem(STORAGE_KEYS.cart, items);
}

export const useCartStore = create<CartState>((set, get) => ({
  items: getStorageItem<CartItem[]>(STORAGE_KEYS.cart, []),

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.productId === item.productId);
      const items = existingItem
        ? state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { ...item, quantity: 1 }];
      persistCart(items);
      return { items };
    }),

  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((i) => i.productId !== productId);
      persistCart(items);
      return { items };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const items =
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            );
      persistCart(items);
      return { items };
    }),

  clearCart: () => {
    persistCart([]);
    set({ items: [] });
  },

  getTotal: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  getItemCount: () =>
    get().items.reduce((count, item) => count + item.quantity, 0),
}));
