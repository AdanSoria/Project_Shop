const stripe = require('../config/stripe');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const emailService = require('../services/email.service');
const User = require('../models/user.model');

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, cartId } = session.metadata;

    try {
      // Find the user's cart to get the items
      const cart = await Cart.getCartByUserId(userId);
      if (!cart || cart.id !== cartId || cart.items.length === 0) {
        console.error(`Webhook Error: Cart not found, cartId mismatch, or cart is empty for userId: ${userId}`);
        return res.status(404).send('Cart not found or is empty.');
      }

      // Recalculate total from product prices in the database to ensure price integrity
      let total = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product && product.price) {
          total += product.price * item.quantity;
        } else {
          console.error(`Webhook Error: Product with ID ${item.productId} not found or has no price.`);
          // Decide if you should fail the entire transaction or just skip the item
        }
      }

      // Create the order in your database
      const order = await Order.createOrder({
        userId,
        items: cart.items,
        total,
        paymentId: session.payment_intent,
        status: 'paid',
      });

      // Clear the user's cart
      await Cart.clearCart(userId);

      // Enviar correo de confirmación
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

          await emailService.sendOrderConfirmation(orderWithDetails, user);
          console.log('✅ Email de confirmación enviado para orden:', order.id);
        }
      } catch (emailError) {
        // Si falla el email, no afecta la orden
        console.error('⚠️ Error al enviar email (orden creada exitosamente):', emailError.message);
      }

      console.log(`✅ Successful payment for user ${userId}. Order created and cart cleared.`);

    } catch (error) {
      console.error('Error in webhook while creating order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

module.exports = {
  handleStripeWebhook,
};
