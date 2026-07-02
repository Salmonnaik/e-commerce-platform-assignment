import { z } from 'zod';

const registerBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['CUSTOMER', 'SELLER', 'ADMIN']).optional(),
});

const loginBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const googleAuthBodySchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
});

const updateProfileBodySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
});

// Schemas for validation middleware that expects body/query/params structure
export const registerSchema = z.object({
  body: registerBodySchema,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: loginBodySchema,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const googleAuthSchema = z.object({
  body: googleAuthBodySchema,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProfileSchema = z.object({
  body: updateProfileBodySchema,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
