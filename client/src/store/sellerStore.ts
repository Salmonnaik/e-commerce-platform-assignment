import { create } from 'zustand';
import type { Seller, SellerAnalytics, SellerBalance } from '../types/seller';

interface SellerState {
  profile: Seller | null;
  balance: SellerBalance | null;
  analytics: SellerAnalytics | null;
  loading: boolean;
  setProfile: (profile: Seller | null) => void;
  setBalance: (balance: SellerBalance | null) => void;
  setAnalytics: (analytics: SellerAnalytics | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSellerStore = create<SellerState>((set) => ({
  profile: null,
  balance: null,
  analytics: null,
  loading: false,

  setProfile: (profile) => set({ profile }),
  setBalance: (balance) => set({ balance }),
  setAnalytics: (analytics) => set({ analytics }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ profile: null, balance: null, analytics: null, loading: false }),
}));
