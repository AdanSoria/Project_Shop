const facturapi = require('../config/facturapi.config');
const Order = require('../models/order.model');
const User = require('../models/user.model');

const invoiceController = {
  async createInvoice(req, res) {
    try {
      const { orderId } = req.body;
      const userId = req.user.id; 

      if (!orderId) {
        return res.status(400).json({ message: 'El ID de la orden es requerido.' });
      }

     
      const user = await User.findById(userId);
      if (!user || !user.rfc || !user.razon_social) {
        return res.status(400).json({ message: 'El usuario no tiene datos fiscales (RFC, Razón Social) para facturar.' });
      }

    
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'La orden no fue encontrada.' });
      }

     
      if (order.userId.toString() !== userId) {
          return res.status(403).json({ message: 'No tienes autorización para facturar esta orden.' });
      }

      //Formatear los productos para Facturapi
      const items = order.items.map(item => ({
        quantity: item.quantity,
        product: {
          description: item.name,
          price: item.price,
          product_key: item.product_key, // Clave de Producto/Servicio del SAT
          tax_included: true, // Asumiendo que los precios incluyen impuestos
        }
      }));

      // 4. Crear la factura en Facturapi
      const invoice = await facturapi.invoices.create({
        customer: {
          legal_name: user.razon_social,
          email: user.correo,
          tax_id: user.rfc,
          tax_system: '616', // "Sin obligaciones fiscales", requerido para el RFC genérico.
          address: {
            zip: user.postal,
            street: user.domicio,
          }
        },
        items: items,
        payment_form: '01', // "01" es para "Efectivo". Esto debería venir de la orden.
        use: 'G03' // "Gastos en general". Esto también podría ser especificado por el usuario.
      });

      // 5. (Opcional) Guardar el ID de la factura en la orden
      // await Order.update(orderId, { invoiceId: invoice.id });

      res.status(201).json({ message: 'Factura creada exitosamente.', invoice });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor al crear la factura.', error: error.message });
    }
  }
};

module.exports = invoiceController;
