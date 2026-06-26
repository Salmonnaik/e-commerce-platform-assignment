import { z } from 'zod';

export const paymentCheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shippingAddressId: z.string().uuid().optional(),
  couponCode: z.string().optional(),
});

export type PaymentCheckoutFormData = z.infer<typeof paymentCheckoutSchema>;
