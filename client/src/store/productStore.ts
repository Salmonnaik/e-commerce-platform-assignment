import { create } from 'zustand';
import type { Product, ProductFilters } from '../types/product';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  totalPages: number;
  loading: boolean;
  setProducts: (products: Product[], totalPages: number) => void;
  setSelectedProduct: (product: Product | null) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setLoading: (loading: boolean) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductFilters = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 12,
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  filters: defaultFilters,
  totalPages: 1,
  loading: false,

  setProducts: (products, totalPages) => set({ products, totalPages }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (loading) => set({ loading }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
