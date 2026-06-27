import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { paymentsApi } from '../api/payments';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Button from '../components/Button';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null as any);

function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add some products before checkout"
        >
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </EmptyState>
      </div>
    );
  }

  const subtotal = getTotal();
  const tax = subtotal * 0.02;
  const shipping = 5;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError('');
    setLoading(true);

    if (!stripe || !elements) {
      setCardError('Stripe is still loading. Please wait a moment.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setCardError('Card input is not ready.');
      setLoading(false);
      return;
    }

    try {
      const response = await paymentsApi.createCheckout({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
      });

      const clientSecret = response.data.data.clientSecret;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.fullName || 'Guest',
          },
        },
      });

      if (error) {
        setCardError(error.message || 'Payment failed. Please try again.');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        clearCart();
        navigate('/orders');
        return;
      }

      setCardError('Payment could not be completed. Please check your card details and try again.');
    } catch (error) {
      const message = (error as Error).message || 'Checkout failed. Please try again.';
      setCardError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
              required
            />
            <Input
              label="Address Line 1"
              value={shippingAddress.addressLine1}
              onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
              required
            />
            <Input
              label="Address Line 2 (Optional)"
              value={shippingAddress.addressLine2}
              onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                required
              />
              <Input
                label="State"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                required
              />
              <Input
                label="Phone"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                required
              />
            </div>
            <Input
              label="Country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card details</label>
              <div className="border rounded-md p-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#111827',
                        '::placeholder': {
                          color: '#9ca3af',
                        },
                      },
                      invalid: {
                        color: '#dc2626',
                      },
                    },
                    hidePostalCode: true,
                  }}
                  onChange={(event: any) => setCardError(event.error?.message || '')}
                />
              </div>
              {cardError && <p className="text-sm text-red-600 mt-2">{cardError}</p>}
            </div>

            <Button type="submit" disabled={loading || !stripe || !elements} className="w-full">
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
