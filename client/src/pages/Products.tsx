import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../api/products';
import { categoriesApi } from '../api/categories';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('category') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 0,
    inStock: searchParams.get('inStock') === 'true',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchProducts();
    } else {
      fetchProducts();
    }
  }, [filters, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getProducts(filters);
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.searchProducts({
        q: searchQuery,
        categoryId: filters.categoryId || undefined,
        page: filters.page,
        limit: filters.limit,
      });
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    updateSearchParams(updated);
  };

  const updateSearchParams = (currentFilters: typeof filters) => {
    const params: Record<string, string> = {};
    if (currentFilters.categoryId) params.category = currentFilters.categoryId;
    if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice.toString();
    if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice.toString();
    if (currentFilters.inStock) params.inStock = 'true';
    if (currentFilters.sortBy) params.sortBy = currentFilters.sortBy;
    if (currentFilters.sortOrder) params.sortOrder = currentFilters.sortOrder;
    if (currentFilters.page > 1) params.page = currentFilters.page.toString();
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params);
  };

  const handleSearch = () => {
    updateFilters({ page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="mb-6">
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilter
            categories={categories}
            selectedCategory={filters.categoryId}
            onCategoryChange={(categoryId) => updateFilters({ categoryId })}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onPriceChange={(min, max) => updateFilters({ minPrice: min, maxPrice: max })}
            inStock={filters.inStock}
            onInStockChange={(inStock) => updateFilters({ inStock })}
            sortBy={`${filters.sortBy}-${filters.sortOrder}`}
            onSortChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
            }}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
