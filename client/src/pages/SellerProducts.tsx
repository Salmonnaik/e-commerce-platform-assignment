import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { sellersApi } from '../api/sellers';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { ROUTES } from '../constants/routes';
import type { Product } from '../types/product';

export default function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    setLoading(true);
    try {
      const response = await sellersApi.getSellerProducts({ page: 1, limit: 24 });
      setProducts(response.data.data.products || []);
    } catch (error) {
      console.error('Failed to fetch seller products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-gray-600 mt-2">Manage products listed under your seller account.</p>
        </div>
        <Button onClick={() => navigate(ROUTES.seller.addProduct)}>Add New Product</Button>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-gray-500 mb-4">You haven’t added any seller products yet.</p>
          <Button onClick={() => navigate(ROUTES.seller.addProduct)}>
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
