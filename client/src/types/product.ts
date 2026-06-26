import type { SortOrder } from './common';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string; name: string; slug: string };
  seller?: { id: string; businessName: string };
}

export interface ProductFilters {
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface ProductSearchParams {
  q: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock?: number;
  images?: string[];
  isActive?: boolean;
}
