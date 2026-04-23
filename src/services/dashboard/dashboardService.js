import api from '../api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getSalesChart: (days = 30) => api.get('/dashboard/sales-chart', { params: { days } }),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getLowStock: () => api.get('/dashboard/low-stock'),
  getExpiringSoon: () => api.get('/dashboard/expiring-soon'),
  getRecentSales: () => api.get('/dashboard/recent-sales'),
  getProfile: () => api.get('/auth/me'),
};

export const alertService = {
  getAll: () => api.get('/alerts'),
  getCount: () => api.get('/alerts/count'),
};

export const invoiceService = {
  getAll: (params = {}) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  getPdf: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
};

export const reportService = {
  getSales: (params) => api.get('/reports/sales', { params }),
  getInventory: () => api.get('/reports/inventory'),
  getFinancial: (params) => api.get('/reports/financial', { params }),
  exportPdf: (type, params) => api.get(`/reports/export/pdf/${type}`, { params, responseType: 'blob' }),
  exportExcel: (type, params) => api.get(`/reports/export/excel/${type}`, { params, responseType: 'blob' }),
};
