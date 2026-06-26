import { z } from 'zod';

export const shippingRateSchema = z.object({
  originPincode: z.string().min(3),
  destinationPincode: z.string().min(3),
  weight: z.number().positive(),
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const trackingWebhookSchema = z.object({
  tracking_number: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.string().min(1),
  location: z.string().optional(),
  description: z.string().optional(),
  timestamp: z.string().optional(),
});
