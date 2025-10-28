const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// @desc    Crear una nueva orden desde el carrito
// @route   POST /api/orders/checkout
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Tu carrito está vacío' });
    }

    // 1. Obtener detalles de los productos y calcular el total
    let total = 0;
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado.`);
        }
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // Guardar el precio histórico
        };
      })
    );

    // 2. Crear la nueva orden
    const createdOrder = await Order.createOrder({
      userId,
      items: orderItems,
      total,
    });

    // 3. Vaciar el carrito del usuario
    await Cart.clearCart(userId);

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error en el servidor al crear la orden', error: error.message });
  }
};

// @desc    Obtener el historial de órdenes del usuario
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// @desc    Obtener una orden específica por ID
// @route   GET /api/orders/:orderId
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Asegurarse de que el usuario solo pueda ver sus propias órdenes
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para ver esta orden' });
    }

    // "Populate" manual de los productos
    const itemsWithDetails = await Promise.all(
        order.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            return {
                ...item,
                product: product ? { name: product.name, description: product.description } : null
            };
        })
    );

    const orderWithDetails = { ...order, items: itemsWithDetails };

    res.json(orderWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};