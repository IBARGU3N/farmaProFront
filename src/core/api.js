import axios from 'axios';
import { API_URL, APP_CONFIG } from '../config/constants';

// Create a configured Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, 
});

// Request Interceptor: Attach the Authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem(APP_CONFIG.AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
