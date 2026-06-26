import { useCallback } from 'react';
import { useSellerStore } from '../store/sellerStore';
import { sellerService } from '../services/sellerService';
import { getErrorMessage } from '../utils/helpers';

export function useSeller() {
  const {
    profile,
    balance,
    analytics,
    loading,
    setProfile,
    setBalance,
    setAnalytics,
    setLoading,
    reset,
  } = useSellerStore();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sellerService.getProfile();
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error(getErrorMessage(error, 'Failed to fetch seller profile'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setProfile]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await sellerService.getBalance();
      setBalance(response.data);
      return response.data;
    } catch (error) {
      console.error(getErrorMessage(error, 'Failed to fetch balance'));
      return null;
    }
  }, [setBalance]);

  const fetchAnalytics = useCallback(
    async (period?: string) => {
      setLoading(true);
      try {
        const response = await sellerService.getAnalytics(period);
        setAnalytics(response.data);
        return response.data;
      } catch (error) {
        console.error(getErrorMessage(error, 'Failed to fetch analytics'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setAnalytics, setLoading]
  );

  const requestPayout = useCallback(
    async (amount: number) => {
      try {
        const response = await sellerService.requestPayout(amount);
        await fetchBalance();
        return response.data;
      } catch (error) {
        console.error(getErrorMessage(error, 'Failed to request payout'));
        throw error;
      }
    },
    [fetchBalance]
  );

  return {
    profile,
    balance,
    analytics,
    loading,
    fetchProfile,
    fetchBalance,
    fetchAnalytics,
    requestPayout,
    reset,
  };
}
