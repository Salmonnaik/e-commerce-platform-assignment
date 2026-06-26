import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
