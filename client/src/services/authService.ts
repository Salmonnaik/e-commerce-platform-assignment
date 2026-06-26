import { authApi } from '../api/auth';
import type { LoginCredentials, RegisterData, User } from '../types/auth';
import type { ApiResponse } from '../types/common';

export const authService = {
  async register(data: RegisterData) {
    const response = await authApi.register(data);
    return response.data as ApiResponse<{ user: User; token: string }>;
  },

  async login(credentials: LoginCredentials) {
    const response = await authApi.login(credentials);
    return response.data as ApiResponse<{ user: User; token: string }>;
  },

  async getProfile() {
    const response = await authApi.getProfile();
    return response.data as ApiResponse<User>;
  },
};
