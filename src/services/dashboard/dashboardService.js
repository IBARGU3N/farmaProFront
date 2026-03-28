import api from '../api';

export const dashboardService = {
  getStats: () => api.get('/inventory/summary'),
  getProfile: () => api.get('/auth/me'),
};
