import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/api';
import { getStorageItem, getStorageString, removeStorageItem, setStorageItem, setStorageString } from '../utils/storage';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    setStorageString(STORAGE_KEYS.token, token);
    setStorageItem(STORAGE_KEYS.user, user);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    removeStorageItem(STORAGE_KEYS.token);
    removeStorageItem(STORAGE_KEYS.user);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = getStorageString(STORAGE_KEYS.token);
    const user = getStorageItem<User | null>(STORAGE_KEYS.user, null);
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
