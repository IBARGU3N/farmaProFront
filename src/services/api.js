import axios from 'axios';

// Create an axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors (like 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific errors here, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
      // TODO: Implement logout or token refresh
      console.error('Unauthorized access');
      // For now, we just reject the error
    }
    return Promise.reject(error);
  }
);

export default api;
