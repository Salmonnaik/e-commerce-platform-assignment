import { DEFAULT_SHIPPING_FEE, TAX_RATE } from '../constants/payment';
import type { CartItem, CartSummary } from '../types/cart';

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calculateTax(subtotal: number, taxRate = TAX_RATE): number {
  return subtotal * taxRate;
}

export function calculateShipping(subtotal: number, flatRate = DEFAULT_SHIPPING_FEE): number {
  return subtotal > 0 ? flatRate : 0;
}

export function calculateTotal(
  subtotal: number,
  taxRate = TAX_RATE,
  shippingFee = DEFAULT_SHIPPING_FEE
): number {
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShipping(subtotal, shippingFee);
  return subtotal + tax + shipping;
}

export function calculateCartSummary(
  items: CartItem[],
  taxRate = TAX_RATE,
  shippingFee = DEFAULT_SHIPPING_FEE
): CartSummary {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShipping(subtotal, shippingFee);
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return { subtotal, tax, shipping, total, itemCount };
}

export function calculateCommission(amount: number, percent = 12): number {
  return amount * (percent / 100);
}

export function calculateDiscount(amount: number, discountPercent: number): number {
  return amount * (discountPercent / 100);
}
