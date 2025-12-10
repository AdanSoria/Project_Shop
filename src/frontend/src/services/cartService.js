import api from './api';

export const cartService = {
  /**
   * Obtener el carrito del usuario
   * @returns {Promise<Object>} Carrito con items
   */
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  /**
   * Agregar un item al carrito
   * @param {string} productId - ID del producto
   * @param {number} quantity - Cantidad
   * @returns {Promise<Object>} Carrito actualizado
   */
  addItem: async (productId, quantity = 1) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  /**
   * Actualizar cantidad de un item
   * @param {string} productId - ID del producto
   * @param {number} quantity - Nueva cantidad
   * @returns {Promise<Object>} Carrito actualizado
   */
  updateItemQuantity: async (productId, quantity) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  /**
   * Eliminar un item del carrito
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>} Carrito actualizado
   */
  removeItem: async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  /**
   * Vaciar el carrito completo
   * @returns {Promise<Object>} Carrito vacío
   */
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
