const Cart = require('../models/cart.model');

// @desc    Obtener el carrito del usuario
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        // Busca el carrito o créalo si no existe
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// @desc    Añadir un ítem al carrito
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // El producto ya existe, actualiza la cantidad
            cart.items[itemIndex].quantity += quantity;
        } else {
            // El producto es nuevo, añádelo al carrito
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// @desc    Actualizar la cantidad de un ítem en el carrito
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateItemQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Ítem no encontrado en el carrito' });
    }

    if (quantity <= 0) {
      // Si la cantidad es 0 o menos, eliminamos el ítem
      cart.items.splice(itemIndex, 1);
    } else {
      // Actualizamos la cantidad
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// @desc    Eliminar un ítem del carrito
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: productId } } }, // Usamos $pull para eliminar del array
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

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
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    cart.items = [];
    await cart.save();
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