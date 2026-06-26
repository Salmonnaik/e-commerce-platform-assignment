import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productsApi } from '../api/products';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { ROUTES } from '../constants/routes';
import type { Product } from '../types/product';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .getProducts({ page: 1, limit: 6, sortBy: 'name', sortOrder: 'asc' })
      .then((response) => {
        setFeaturedProducts(response.data.data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to EnterpriseShop
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Your trusted multi-vendor e-commerce platform
            </p>
            <Link
              to={ROUTES.products}
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to={`${ROUTES.products}?category=11111111-1111-1111-1111-111111111101`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
          >
            <h3 className="text-xl font-semibold mb-2">Electronics</h3>
            <p className="text-gray-600">Latest gadgets and devices</p>
          </Link>
          <Link
            to={`${ROUTES.products}?category=11111111-1111-1111-1111-111111111102`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
          >
            <h3 className="text-xl font-semibold mb-2">Fashion</h3>
            <p className="text-gray-600">Trending styles and accessories</p>
          </Link>
          <Link
            to={`${ROUTES.products}?category=11111111-1111-1111-1111-111111111103`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
          >
            <h3 className="text-xl font-semibold mb-2">Home & Garden</h3>
            <p className="text-gray-600">Everything for your home</p>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to={ROUTES.products} className="text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
