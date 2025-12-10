import { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { productService } from '../services/productService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { isAuthenticated } = useAuth();

  // Cargar el carrito cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      setCart({ items: [] });
      setTotal(0);
    }
  }, [isAuthenticated]);

  // Calcular el total cuando cambie el carrito
  useEffect(() => {
    calculateTotal();
  }, [cart]);

  // Obtener el carrito del servidor
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response);
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  // Calcular el total del carrito
  const calculateTotal = async () => {
    if (!cart.items || cart.items.length === 0) {
      setTotal(0);
      return;
    }

    try {
      let totalAmount = 0;
      
      // Obtener el precio de cada producto
      for (const item of cart.items) {
        const product = await productService.getById(item.productId);
        if (product) {
          totalAmount += product.price * item.quantity;
        }
      }
      
      setTotal(totalAmount);
    } catch (error) {
      console.error('Error al calcular el total:', error);
    }
  };

  // Agregar un producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated()) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return { success: false };
    }

    try {
      const response = await cartService.addItem(productId, quantity);
      setCart(response);
      toast.success('Producto agregado al carrito');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al agregar al carrito';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Actualizar la cantidad de un producto
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 0) return;

    try {
      const response = await cartService.updateItemQuantity(productId, quantity);
      setCart(response);
      
      if (quantity === 0) {
        toast.success('Producto eliminado del carrito');
      }
      
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar cantidad';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Incrementar cantidad de un producto
  const incrementQuantity = async (productId) => {
    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      await updateQuantity(productId, item.quantity + 1);
    }
  };

  // Decrementar cantidad de un producto
  const decrementQuantity = async (productId) => {
    const item = cart.items.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      await updateQuantity(productId, item.quantity - 1);
    }
  };

  // Eliminar un producto del carrito
  const removeFromCart = async (productId) => {
    try {
      const response = await cartService.removeItem(productId);
      setCart(response);
      toast.success('Producto eliminado del carrito');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar del carrito';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Vaciar el carrito
  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      setCart(response);
      toast.success('Carrito vaciado');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al vaciar el carrito';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Obtener el número de items en el carrito
  const getCartItemsCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cart.items.some(item => item.productId === productId);
  };

  // Obtener la cantidad de un producto en el carrito
  const getItemQuantity = (productId) => {
    const item = cart.items.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    total,
    fetchCart,
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
