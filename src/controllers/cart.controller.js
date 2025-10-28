const Cart = require('../models/cart.model');


const getCart = async (req, res) => {
    try {
        const cart = await Cart.getCartByUserId(req.user.id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};


const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.addItem(userId, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const updateItemQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.updateItemQuantity(userId, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};


const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.removeItem(userId, productId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// @desc    Vaciar el carrito del usuario
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.clearCart(userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};