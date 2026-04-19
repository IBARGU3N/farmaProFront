import api from '../api';

export const posService = {
  processSale: (data) => api.post('/pos/sale', data),
  initiateMercadoPago: (data) => api.post('/pos/sale/initiate-mp', data),
  getReceipt: (id) => api.get(`/pos/sale/${id}/receipt`),
  getCashRegisterStatus: () => api.get('/pos/cash-register/status'),
  getCashRegisters: () => api.get('/pos/cash-registers'),
  openCashRegister: (data) => api.post('/pos/cash-register/open', data),
  switchCashRegister: (data) => api.post('/pos/cash-register/switch', data),
  closeCashRegister: (data) => api.post('/pos/cash-register/close', data),
  addMovement: (data) => api.post('/pos/cash-register/movement', data),
};
