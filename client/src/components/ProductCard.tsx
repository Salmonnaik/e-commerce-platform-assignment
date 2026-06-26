import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  seller?: string;
  stock?: number;
  product?: Product;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({
  id: idProp,
  name: nameProp,
  price: priceProp,
  image: imageProp,
  category: categoryProp,
  seller: sellerProp,
  stock: stockProp,
  product,
  onAddToCart,
}: ProductCardProps) {
  const id = product?.id ?? idProp ?? '';
  const name = product?.name ?? nameProp ?? '';
  const price = product?.price ?? priceProp ?? 0;
  const image = product?.images?.[0] ?? imageProp;
  const category = product?.category?.name ?? categoryProp;
  const seller = product?.seller?.businessName ?? sellerProp;
  const stock = product?.stock ?? stockProp;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <Link to={`/products/${id}`}>
        <div className="h-48 bg-gray-200 relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {stock !== undefined && stock <= 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition line-clamp-2">
            {name}
          </h3>
        </Link>
        {category && (
          <p className="text-sm text-gray-500 mb-2">{category}</p>
        )}
        {seller && (
          <p className="text-xs text-gray-400 mb-2">by {seller}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-600">
            ${price.toFixed(2)}
          </span>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(id)}
              disabled={stock === 0}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
