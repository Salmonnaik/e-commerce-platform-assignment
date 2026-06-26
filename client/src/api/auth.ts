import api from './axios';

export const authApi = {
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () =>
    api.get('/auth/profile'),
};
