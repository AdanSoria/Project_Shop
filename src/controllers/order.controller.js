const stripe = require('../config/stripe');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const emailService = require('../services/email.service');
const User = require('../models/user.model');

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

// @desc    Crear un cargo directo con Stripe y registrar la orden
// @route   POST /api/orders/charge
// @access  Private
const createDirectCharge = async (req, res) => {
  const { source } = req.body; // 'source' is the tokenized card details from frontend (e.g., 'tok_visa')
  const userId = req.user.id;

  try {
    // 1. Get user's cart
    const cart = await Cart.getCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Tu carrito está vacío' });
    }

    // 2. Recalculate total server-side to prevent tampering
    let amount = 0;
    await Promise.all(
        cart.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Producto con ID ${item.productId} no encontrado.`);
            }
            amount += product.price * item.quantity;
        })
    );

    const amountInCents = Math.round(amount * 100);
    if (amountInCents <= 0) {
        return res.status(400).json({ message: 'El monto del cargo debe ser positivo.' });
    }

    // 3. Create a charge using Stripe API
    const charge = await stripe.charges.create({
      amount: amountInCents,
      currency: 'mxn',
      source: source,
      description: `Cargo para el usuario ${userId}`,
    });

    // 4. If charge is successful, create the order in the database
    if (charge.paid) {
      const order = await Order.createOrder({
        userId,
        items: cart.items,
        total: amount, // Use the server-calculated total
        paymentId: charge.id, // Store the charge ID
        status: 'paid',
      });

      // 5. Clear the cart
      await Cart.clearCart(userId);

      // 6. Obtener datos del usuario para enviar el correo
      try {
        const user = await User.findById(userId);
        if (user && user.correo) {
          // Obtener detalles de productos para el email
          const orderWithDetails = { ...order };
          orderWithDetails.items = await Promise.all(
            order.items.map(async (item) => {
              const product = await Product.findById(item.productId);
              return {
                ...item,
                product: product ? { name: product.name } : { name: 'Producto' }
              };
            })
          );

          // Enviar correo de confirmación
          await emailService.sendOrderConfirmation(orderWithDetails, user);
          console.log('✅ Email de confirmación enviado para orden:', order.id);
        }
      } catch (emailError) {
        // Si falla el email, no afecta la orden
        console.error('⚠️ Error al enviar email (orden creada exitosamente):', emailError.message);
      }

      res.status(201).json({ success: true, order });
    } else {
      res.status(400).json({ success: false, message: 'El pago no pudo ser procesado.' });
    }
  } catch (error) {
    console.error('Error creating direct charge:', error);
    if (error.raw && error.raw.message) {
        return res.status(400).json({ message: error.raw.message });
    }
    res.status(500).json({ message: 'Error en el servidor al procesar el pago', error: error.message });
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
  createDirectCharge,
};