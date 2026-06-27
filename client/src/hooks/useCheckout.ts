import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from './useCart';
import { paymentService } from '../services/paymentService';
import { checkoutSchema } from '../validation/checkoutSchema';
import { getErrorMessage } from '../utils/helpers';
import type { CheckoutFormData } from '../validation/checkoutSchema';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null as any);

export function useCheckout() {
  const navigate = useNavigate();
  const { items, summary, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCheckout = useCallback(
    async (formData: CheckoutFormData) => {
      setLoading(true);
      setError(null);

      try {
        const validated = checkoutSchema.parse({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: formData.shippingAddress,
          couponCode: formData.couponCode,
        });

        const response = await paymentService.createCheckout({
          items: validated.items,
          shippingAddress: validated.shippingAddress,
          couponCode: validated.couponCode,
        });

        const { clientSecret } = response.data;
        const stripe = await stripePromise;

        if (stripe && clientSecret) {
          const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: { card: {} as never } }
          );

          if (stripeError) {
            throw new Error(stripeError.message);
          }

          if (paymentIntent?.status === 'succeeded') {
            clearCart();
            navigate('/orders');
          }
        }

        return response.data;
      } catch (err) {
        const message = getErrorMessage(err, 'Checkout failed');
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [items, clearCart, navigate]
  );

  return {
    items,
    summary,
    loading,
    error,
    submitCheckout,
  };
}
