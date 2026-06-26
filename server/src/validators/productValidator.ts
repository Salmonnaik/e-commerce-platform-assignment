import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().uuid('Invalid category ID'),
  stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  price: z.number().positive('Price must be positive').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  isActive: z.boolean().optional(),
});

export const updateInventorySchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  lowStockThreshold: z.number().int().min(0, 'Low stock threshold must be non-negative').optional(),
});
