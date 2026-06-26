import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../api/categories';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Categories will appear here once added"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
            >
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 mb-4">{category.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {category.productCount || 0} products
                </span>
                <span className="text-primary-600 font-medium">Browse →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
