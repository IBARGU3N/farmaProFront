import api from '../api';

export const authService = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Logout user (invalidate token)
  logout: () => api.post('/auth/logout'),
  
  // Refresh access token using refresh token
  refresh: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  
  // Send password reset link
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password with token
  resetPassword: ({ token, email, password, password_confirmation }) => 
    api.post('/auth/reset-password', { token, email, password, password_confirmation }),
    
  // Check if user is authenticated (optional endpoint)
  checkAuth: () => api.get('/auth/me'), // We'll need to implement this on backend later
};
