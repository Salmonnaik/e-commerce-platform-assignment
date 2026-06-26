import { useMemo } from 'react';
import { useCartStore } from '../store/cartStore';
import { calculateCartSummary } from '../utils/calculations';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const summary = useMemo(() => calculateCartSummary(items), [items]);
  const isEmpty = items.length === 0;

  return {
    items,
    summary,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };
}
