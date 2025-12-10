import api from './api';

export const productService = {
  /**
   * Obtener todos los productos
   * @returns {Promise<Array>} Lista de productos
   */
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  /**
   * Obtener un producto por ID
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Producto
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo producto (solo admin)
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Actualizar un producto (solo admin)
   * @param {string} id - ID del producto
   * @param {Object} productData - Datos actualizados
   * @returns {Promise<Object>} Producto actualizado
   */
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Eliminar un producto (solo admin)
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Mensaje de confirmación
   */
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
