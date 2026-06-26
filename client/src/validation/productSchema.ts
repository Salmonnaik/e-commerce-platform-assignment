import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than zero'),
  categoryId: z.string().uuid('Please select a valid category'),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
  isActive: z.boolean().optional(),
});

export const productFilterSchema = z.object({
  categoryId: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductFilterFormData = z.infer<typeof productFilterSchema>;
