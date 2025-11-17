const stripe = require('../config/stripe');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// @desc    Crear una sesión de checkout de Stripe
// @route   POST /api/orders/checkout
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Tu carrito está vacío' });
    }

    // Create line_items for Stripe, ensuring to fetch the latest price from the DB
    const line_items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          // This error should be caught by the outer try-catch block
          throw new Error(`Producto con ID ${item.productId} no encontrado.`);
        }
        return {
          price_data: {
            currency: 'mxn', // Change to your desired currency
            product_data: {
              name: product.name,
              images: product.imageUrl ? [product.imageUrl] : [],
            },
            unit_amount: Math.round(product.price * 100), // Price in cents, rounded to avoid floating point issues
          },
          quantity: item.quantity,
        };
      })
    );

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment-cancelled`,
      metadata: {
        userId: userId,
        cartId: cart.id,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ message: 'Error en el servidor al crear la sesión de pago', error: error.message });
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