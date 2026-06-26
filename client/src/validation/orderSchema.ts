import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  shippingAddressId: z.string().uuid('Shipping address is required'),
  couponCode: z.string().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().max(500, 'Reason must be 500 characters or less').optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type CancelOrderFormData = z.infer<typeof cancelOrderSchema>;
