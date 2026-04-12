import api from '../api';

export const inventoryService = {
  summary: () => api.get('/inventory/summary'),
  laboratorios: () => api.get('/inventory/laboratorios'),
  productos: () => api.get('/inventory/productos'),
  lotes: () => api.get('/inventory/lotes'),
};

export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (q) => api.get('/products/search', { params: { q } }),
  getLots: (id) => api.get(`/products/${id}/lots`),
};

export const lotService = {
  getAll: (params = {}) => api.get('/lots', { params }),
  getById: (id) => api.get(`/lots/${id}`),
  create: (data) => api.post('/lots', data),
  update: (id, data) => api.put(`/lots/${id}`, data),
  delete: (id) => api.delete(`/lots/${id}`),
};

export const stockService = {
  adjust: (data) => api.post('/stock/adjust', data),
  getMovements: (params = {}) => api.get('/stock/movements', { params }),
};
