import { z } from 'zod';

export const sellerProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessEmail: z.string().email('Valid business email is required').optional(),
  businessPhone: z.string().min(10, 'Valid phone number is required').optional(),
  taxId: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
});

export const payoutRequestSchema = z.object({
  amount: z.number().positive('Payout amount must be greater than zero'),
});

export type SellerProfileFormData = z.infer<typeof sellerProfileSchema>;
export type PayoutRequestFormData = z.infer<typeof payoutRequestSchema>;
