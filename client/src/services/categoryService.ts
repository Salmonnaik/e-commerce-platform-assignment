import { categoriesApi } from '../api/categories';
import type { Category, CreateCategoryData } from '../types/category';
import type { ApiResponse } from '../types/common';

export const categoryService = {
  async getCategories() {
    const response = await categoriesApi.getCategories();
    return response.data as ApiResponse<Category[]>;
  },

  async getCategory(id: string) {
    const response = await categoriesApi.getCategory(id);
    return response.data as ApiResponse<Category>;
  },

  async createCategory(data: CreateCategoryData) {
    const response = await categoriesApi.createCategory(data);
    return response.data as ApiResponse<Category>;
  },

  async updateCategory(id: string, data: Partial<CreateCategoryData>) {
    const response = await categoriesApi.updateCategory(id, data);
    return response.data as ApiResponse<Category>;
  },

  async deleteCategory(id: string) {
    const response = await categoriesApi.deleteCategory(id);
    return response.data;
  },
};
