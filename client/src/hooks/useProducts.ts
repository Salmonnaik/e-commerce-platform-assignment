import { useCallback, useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { productService } from '../services/productService';
import { getErrorMessage } from '../utils/helpers';
import type { ProductFilters, ProductSearchParams } from '../types/product';

export function useProducts(initialFilters?: Partial<ProductFilters>) {
  const {
    products,
    filters,
    totalPages,
    loading,
    setProducts,
    setFilters,
    setLoading,
    resetFilters,
  } = useProductStore();

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters, setFilters]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data.products, response.data.pagination.totalPages);
    } catch (error) {
      console.error(getErrorMessage(error, 'Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [filters, setLoading, setProducts]);

  const searchProducts = useCallback(
    async (params: ProductSearchParams) => {
      setLoading(true);
      try {
        const response = await productService.searchProducts(params);
        setProducts(response.data.products, response.data.pagination.totalPages);
      } catch (error) {
        console.error(getErrorMessage(error, 'Failed to search products'));
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setProducts]
  );

  return {
    products,
    filters,
    totalPages,
    loading,
    setFilters,
    resetFilters,
    fetchProducts,
    searchProducts,
  };
}
