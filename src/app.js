
require('dotenv').config();
const express = require('express');

require('./config/facturapi.config');
// Inicializar la configuración de Firebase
require('./config/firebase.config');

const app = express();

// Stripe webhook needs raw body, so it must be registered before express.json()
const webhookRoutes = require('./routes/webhook.routes');
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Middleware para parsear JSON para todas las otras rutas
app.use(express.json());

//rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const invoiceRoutes = require('./routes/invoice.routes');


//Endpoints base
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);

// Iniciar el servidor

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
