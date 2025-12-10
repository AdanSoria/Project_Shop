import api from './api';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const authService = {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario registrado
   */
  register: async (userData) => {
    // Primero registrar en el backend (esto también crea el usuario en Firebase Auth desde el servidor)
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Iniciar sesión con Firebase Authentication
   * @param {string} username - Nombre de usuario (usaremos el correo)
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Token y mensaje
   */
  login: async (username, password) => {
    // Primero obtenemos el correo del usuario usando el username
    const userResponse = await api.post('/auth/login', { username, password });
    
    if (userResponse.data.token) {
      // Guardar token del backend
      localStorage.setItem('token', userResponse.data.token);
      
      // Decodificar el token para obtener info del usuario
      const userInfo = JSON.parse(atob(userResponse.data.token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
    
    return userResponse.data;
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión en Firebase:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual desde localStorage
   * @returns {Object|null} Usuario actual
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si hay un usuario autenticado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
