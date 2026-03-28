import api from '../api';

export const inventoryService = {
  summary: () => api.get('/inventory/summary'),
  laboratorios: () => api.get('/inventory/laboratorios'),
  productos: () => api.get('/inventory/productos'),
  lotes: () => api.get('/inventory/lotes'),
};
