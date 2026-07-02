import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../api/products';
import { useCartStore } from '../store/useCartStore';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const { addItem, updateQuantity, items } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getProduct(id!);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0],
      });
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0],
    };

    const existingItem = items.find((item) => item.productId === product.id);
    if (existingItem) {
      updateQuantity(product.id, quantity);
    } else {
      addItem(cartItem);
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    }

    navigate('/checkout');
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="The product you're looking for doesn't exist"
      />
    );
  }

  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <nav className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            {' / '}
            <Link to="/products" className="hover:text-primary-600">Products</Link>
            {' / '}
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold text-primary-600">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.inventory?.available > 0 ? (
              <span className="ml-4 text-green-600 text-sm">In Stock</span>
            ) : (
              <span className="ml-4 text-red-600 text-sm">Out of Stock</span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Category</h3>
            <Link
              to={`/products?category=${product.category.id}`}
              className="text-primary-600 hover:text-primary-700"
            >
              {product.category.name}
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Seller</h3>
            <span className="text-gray-600">{product.seller.businessName}</span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 border rounded-md hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border rounded-md">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 border rounded-md hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.inventory?.available === 0}
              className="w-full"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={product.inventory?.available === 0}
              variant="secondary"
              className="w-full"
            >
              Buy Now
            </Button>
          </div>

          {product.inventory && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Inventory</h3>
              <div className="text-sm text-gray-600">
                <p>Available: {product.inventory.available}</p>
                <p>Reserved: {product.inventory.reserved}</p>
                <p>Total: {product.inventory.quantity}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
