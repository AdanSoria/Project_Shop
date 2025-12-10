import api from './api';

export const invoiceService = {
  /**
   * Generar factura para una orden
   * @param {string} orderId - ID de la orden
   * @returns {Promise<Object>} Factura generada
   */
  createInvoice: async (orderId) => {
    const response = await api.post('/invoices', { orderId });
    return response.data;
  },
};
