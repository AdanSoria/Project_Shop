import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario autenticado al cargar la app
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('¡Usuario registrado exitosamente! Por favor inicia sesión.');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar el usuario';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      toast.success('¡Bienvenido de nuevo!');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Credenciales inválidas';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Sesión cerrada correctamente');
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user?.rol === 'admin';
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
