import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function Cart() {
  const { items, getTotal, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.02;
  const shipping = 5;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add some products to get started"
        >
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="flex justify-between items-center mt-6">
            <Button variant="secondary" onClick={handleContinueShopping}>
              Continue Shopping
            </Button>
            <Button variant="danger" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (2%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button onClick={handleCheckout} className="w-full">
            Proceed to Checkout
          </Button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
