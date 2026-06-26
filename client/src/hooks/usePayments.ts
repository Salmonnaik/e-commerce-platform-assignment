import { useCallback, useState } from 'react';
import { paymentService } from '../services/paymentService';
import { getErrorMessage } from '../utils/helpers';
import type { CheckoutData } from '../types/payment';

export function usePayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(async (data: CheckoutData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.createCheckout(data);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, 'Payment failed');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPayment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPayment(id);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to fetch payment');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, createCheckout, getPayment };
}
