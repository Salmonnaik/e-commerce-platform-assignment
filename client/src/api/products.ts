import api from './axios';
import {
  filterMockProducts,
  getMockProduct,
  searchMockProducts,
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

export const productsApi = {
  getProducts: (params?: {
    categoryId?: string;
    sellerId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) =>
    withMockFallback(
      () => api.get('/v1/products', { params }),
      filterMockProducts(params)
    ),

  getProduct: (id: string) =>
    withMockFallback(
      () => api.get(`/v1/products/${id}`),
      getMockProduct(id)
    ),

  searchProducts: (params: {
    q: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }) =>
    withMockFallback(
      () => api.get('/v1/products/search', { params }),
      searchMockProducts(params)
    ),

  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    stock?: number;
    images?: string[];
    isActive?: boolean;
  }) => api.post('/v1/products', data),

  updateProduct: (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      categoryId?: string;
      stock?: number;
      images?: string[];
      isActive?: boolean;
    }
  ) => api.put(`/v1/products/${id}`, data),

  deleteProduct: (id: string) => api.delete(`/v1/products/${id}`),

  updateInventory: (
    id: string,
    data: {
      quantity: number;
      lowStockThreshold?: number;
    }
  ) => api.patch(`/v1/products/${id}/inventory`, data),
};
