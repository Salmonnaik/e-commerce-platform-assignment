import { productsApi } from '../api/products';
import type { CreateProductData, Product, ProductFilters, ProductSearchParams } from '../types/product';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export const productService = {
  async getProducts(filters?: ProductFilters) {
    const response = await productsApi.getProducts(filters);
    return response.data as ApiResponse<{
      products: Product[];
      pagination: PaginatedResponse<Product>['pagination'];
    }>;
  },

  async getProduct(id: string) {
    const response = await productsApi.getProduct(id);
    return response.data as ApiResponse<Product>;
  },

  async searchProducts(params: ProductSearchParams) {
    const response = await productsApi.searchProducts(params);
    return response.data as ApiResponse<{
      products: Product[];
      pagination: PaginatedResponse<Product>['pagination'];
    }>;
  },

  async createProduct(data: CreateProductData) {
    const response = await productsApi.createProduct(data);
    return response.data as ApiResponse<Product>;
  },

  async updateProduct(id: string, data: Partial<CreateProductData>) {
    const response = await productsApi.updateProduct(id, data);
    return response.data as ApiResponse<Product>;
  },

  async deleteProduct(id: string) {
    const response = await productsApi.deleteProduct(id);
    return response.data;
  },

  async updateInventory(id: string, quantity: number, lowStockThreshold?: number) {
    const response = await productsApi.updateInventory(id, { quantity, lowStockThreshold });
    return response.data;
  },
};
