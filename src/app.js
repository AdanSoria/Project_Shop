require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./config/facturapi.config');
// Inicializar la configuración de Firebase
require('./config/firebase.config');

const app = express();

// ========== CONFIGURAR CORS PRIMERO ==========
// IMPORTANTE: Esto debe ir ANTES de cualquier otra configuración
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman) o desde localhost
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueó origen:', origin);
      callback(null, true); // Permitir por ahora para debug
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ========== WEBHOOK STRIPE ==========
// Stripe webhook needs raw body, so it must be registered before express.json()
const webhookRoutes = require('./routes/webhook.routes');
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// ========== MIDDLEWARE JSON ==========
// Middleware para parsear JSON para todas las otras rutas
app.use(express.json());

// ========== RUTAS ==========
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const invoiceRoutes = require('./routes/invoice.routes');

// Endpoints base
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: 'Error en el servidor', 
    error: err.message 
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✅ CORS habilitado para: http://localhost:5173`);
  console.log(`✅ Health check disponible en: http://localhost:${PORT}/api/health`);
});

module.exports = app;
