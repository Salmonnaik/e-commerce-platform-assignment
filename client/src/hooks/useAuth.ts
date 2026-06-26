import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterData } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setAuth, logout, initialize } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials);
      setAuth(response.data.user, response.data.token);
      return response.data;
    },
    [setAuth]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const response = await authService.register(data);
      setAuth(response.data.user, response.data.token);
      return response.data;
    },
    [setAuth]
  );

  const refreshProfile = useCallback(async () => {
    const response = await authService.getProfile();
    if (token) {
      setAuth(response.data, token);
    }
    return response.data;
  }, [setAuth, token]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    refreshProfile,
    logout: handleLogout,
    initialize,
  };
}
