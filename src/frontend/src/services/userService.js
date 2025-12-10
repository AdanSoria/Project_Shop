import api from './api';

export const userService = {
  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<Object>} Perfil del usuario
   */
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  /**
   * Actualizar perfil del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
};
