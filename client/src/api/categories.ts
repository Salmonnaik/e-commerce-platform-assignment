import api from './axios';
import {
  getMockCategoriesWithCounts,
  MOCK_CATEGORIES,
} from '../data/mockProducts';

type ApiPayload<T> = {
  data: {
    success: boolean;
    message: string;
    data: T;
  };
};

const shouldUseMock = () => import.meta.env.VITE_USE_MOCK_DATA !== 'false';

async function withMockFallback<T>(
  apiCall: () => Promise<ApiPayload<T>>,
  mockData: T
): Promise<ApiPayload<T>> {
  if (!shouldUseMock()) {
    return apiCall();
  }
  try {
    return await apiCall();
  } catch {
    return {
      data: {
        success: true,
        message: 'Success',
        data: mockData,
      },
    };
  }
}

export const categoriesApi = {
  getCategories: () =>
    withMockFallback(
      () => api.get('/v1/categories'),
      getMockCategoriesWithCounts()
    ),

  getCategory: (id: string) =>
    withMockFallback(
      () => api.get(`/v1/categories/${id}`),
      MOCK_CATEGORIES.find((category) => category.id === id) ?? null
    ),

  createCategory: (data: { name: string; description?: string }) =>
    api.post('/v1/categories', data),

  updateCategory: (
    id: string,
    data: { name?: string; description?: string }
  ) => api.put(`/v1/categories/${id}`, data),

  deleteCategory: (id: string) => api.delete(`/v1/categories/${id}`),
};
