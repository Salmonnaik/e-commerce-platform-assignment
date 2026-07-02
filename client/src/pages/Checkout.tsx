import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe, Stripe as StripeType } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '../store/useCartStore';
import { paymentsApi } from '../api/payments';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Button from '../components/Button';
import { ROUTES } from '../constants/routes';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe once and reuse the promise
let stripePromise: Promise<StripeType | null> | null = null;

function getStripePromise() {
  if (!stripePromise) {
    if (stripePublishableKey) {
      console.log('[Stripe] Initializing with key:', stripePublishableKey.substring(0, 20) + '...');
      stripePromise = loadStripe(stripePublishableKey);
    } else {
      console.warn('[Stripe] No publishable key found. Using demo mode.');
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
}

function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stripeReady, setStripeReady] = useState(false);
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

  // Monitor Stripe initialization
  useEffect(() => {
    if (stripe && elements && stripePublishableKey) {
      console.log('[Stripe] Stripe and Elements are ready');
      setStripeReady(true);
      setPaymentError('');
    } else if (!stripePublishableKey) {
      console.log('[Stripe] Demo mode - no Stripe key');
      setStripeReady(true); // In demo mode, we're "ready" without Stripe
    } else {
      console.warn('[Stripe] Waiting for Stripe initialization...');
    }
  }, [stripe, elements]);

  const useDemoPayment = !stripePublishableKey;

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

  const checkoutPayload = {
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
  };

  // Validate shipping address
  const isShippingAddressValid = () => {
    return (
      shippingAddress.fullName &&
      shippingAddress.addressLine1 &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.postalCode &&
      shippingAddress.phone
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    setSuccessMessage('');
    
    // Validate form
    if (!isShippingAddressValid()) {
      setPaymentError('Please fill in all required shipping information.');
      return;
    }

    setLoading(true);

    try {
      console.log('[Checkout] Creating checkout...');
      const response = await paymentsApi.createCheckout(checkoutPayload);
      const result = response.data.data;

      console.log('[Checkout] Checkout response:', result);

      // Handle demo payment mode
      if (result?.isDemoPayment) {
        console.log('[Checkout] Demo payment mode - redirecting to order success');
        const demoPayload = { ...result.demoData, isDemoPayment: true };
        sessionStorage.setItem('demoPaymentData', JSON.stringify(demoPayload));
        sessionStorage.setItem('lastOrderId', result.order.id);
        sessionStorage.setItem(`demoData_${result.order.id}`, JSON.stringify(demoPayload));
        clearCart();
        navigate(ROUTES.orderSuccess(result.order.id));
        return;
      }

      // Handle real Stripe payment
      if (!stripe) {
        setPaymentError('Stripe failed to initialize. Please refresh the page and try again.');
        console.error('[Stripe] Stripe instance not available');
        return;
      }

      if (!elements) {
        setPaymentError('Payment elements failed to initialize. Please refresh the page and try again.');
        console.error('[Stripe] Elements not available');
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setPaymentError('Card input failed to initialize. Please refresh the page and try again.');
        console.error('[Stripe] CardElement not found');
        return;
      }

      const clientSecret = result.clientSecret;
      if (!clientSecret) {
        setPaymentError('Unable to create payment. Please try again.');
        console.error('[Checkout] No clientSecret in response');
        return;
      }

      console.log('[Stripe] Confirming card payment with clientSecret:', clientSecret.substring(0, 30) + '...');
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.fullName || 'Guest',
            email: '',
            address: {
              line1: shippingAddress.addressLine1,
              line2: shippingAddress.addressLine2 || undefined,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: 'US',
            },
          },
        },
      });

      if (error) {
        console.error('[Stripe] Payment error:', error);
        setPaymentError(error.message || 'Payment failed. Please try again.');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log('[Stripe] Payment succeeded:', paymentIntent.id);
        setSuccessMessage('Payment successful! Redirecting to order confirmation...');
        clearCart();
        
        // Redirect to order success page
        setTimeout(() => {
          navigate(ROUTES.orderSuccess(result.order.id));
        }, 1000);
      } else if (paymentIntent?.status === 'requires_action') {
        console.log('[Stripe] Payment requires additional action');
        setPaymentError('Payment requires additional verification. Please follow the prompts.');
      } else {
        console.warn('[Stripe] Unexpected payment intent status:', paymentIntent?.status);
        setPaymentError('Payment could not be completed. Please check your card details and try again.');
      }
    } catch (error: any) {
      console.error('[Checkout] Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Checkout failed. Please try again.';
      setPaymentError(errorMessage);
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
                  <span>
                    {item.name} x {item.quantity}
                  </span>
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

            {useDemoPayment ? (
              <div className="mb-4">
                <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                  <p className="font-semibold">🧪 Demo Payment Mode</p>
                  <p className="text-xs mt-1">Stripe is not configured. The checkout will simulate a successful payment for testing.</p>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Details
                  {!stripeReady && <span className="text-orange-500 ml-2">(Loading...)</span>}
                </label>
                <div className="border rounded-md p-4 bg-white">
                  {stripePublishableKey && !stripe ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center text-gray-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm">Loading Stripe...</p>
                      </div>
                    </div>
                  ) : stripe && elements ? (
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#111827',
                            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
                      onChange={(event) => {
                        if (event.error) {
                          setCardError(event.error.message);
                          setPaymentError(event.error.message);
                        } else {
                          setCardError('');
                          if (!paymentError) setPaymentError('');
                        }
                      }}
                    />
                  ) : (
                    <div className="text-red-600 text-sm p-4 bg-red-50 rounded border border-red-200">
                      ⚠️ Failed to load card input. Please refresh the page and try again.
                    </div>
                  )}
                </div>
                {cardError && (
                  <p className="text-sm text-red-600 mt-2">
                    <span className="font-semibold">Card Error:</span> {cardError}
                  </p>
                )}
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                  <p className="font-semibold mb-2">Test Card Numbers:</p>
                  <p>• <strong>4242 4242 4242 4242</strong> - Success</p>
                  <p>• <strong>4000 0000 0000 0002</strong> - Decline</p>
                  <p className="mt-2">• Expiry: Any future date</p>
                  <p>• CVV: Any 3 digits</p>
                </div>
              </div>
            )}

            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-600">
                  <span className="font-semibold">Error:</span> {paymentError}
                </p>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-600 font-semibold">{successMessage}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !stripeReady || (!useDemoPayment && !stripe)}
              className="w-full"
            >
              {loading
                ? 'Processing Payment...'
                : !stripeReady
                  ? 'Loading...'
                  : useDemoPayment
                    ? `Complete Payment (Demo) — $${total.toFixed(2)}`
                    : `Pay with Card — $${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={getStripePromise()}>
      <CheckoutForm />
    </Elements>
  );
}
