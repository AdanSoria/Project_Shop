import api from './api';

export const orderService = {
  /**
   * Crear sesión de checkout de Stripe
   * @returns {Promise<Object>} URL de checkout
   */
  createCheckout: async () => {
    const response = await api.post('/orders/checkout');
    return response.data;
  },

  /**
   * Crear cargo directo con tarjeta tokenizada
   * @param {string} source - Token de Stripe
   * @returns {Promise<Object>} Orden creada
   */
  createDirectCharge: async (source) => {
    const response = await api.post('/orders/charge', { source });
    return response.data;
  },

  /**
   * Obtener órdenes del usuario
   * @returns {Promise<Array>} Lista de órdenes
   */
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  /**
   * Obtener detalle de una orden
   * @param {string} orderId - ID de la orden
   * @returns {Promise<Object>} Detalle de la orden
   */
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
};
