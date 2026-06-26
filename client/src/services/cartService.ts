import { useCartStore } from '../store/cartStore';
import { calculateCartSummary } from '../utils/calculations';
import type { CartItem, CartSummary } from '../types/cart';

export const cartService = {
  getItems(): CartItem[] {
    return useCartStore.getState().items;
  },

  getSummary(): CartSummary {
    return calculateCartSummary(useCartStore.getState().items);
  },

  addItem(item: Omit<CartItem, 'quantity'>) {
    useCartStore.getState().addItem(item);
  },

  removeItem(productId: string) {
    useCartStore.getState().removeItem(productId);
  },

  updateQuantity(productId: string, quantity: number) {
    useCartStore.getState().updateQuantity(productId, quantity);
  },

  clearCart() {
    useCartStore.getState().clearCart();
  },

  toCheckoutItems() {
    return useCartStore.getState().items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  },
};
