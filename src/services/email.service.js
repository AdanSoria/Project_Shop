const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailService = {
  /**
   * Enviar correo de confirmación de compra
   * @param {Object} orderData - Datos de la orden
   * @param {Object} userData - Datos del usuario
   */
  sendOrderConfirmation: async (orderData, userData) => {
    try {
      const { id, items, total, createdAt } = orderData;
      const { correo, nombre, username } = userData;

      // Construir lista de productos
      const productsList = items.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${item.product?.name || 'Producto'}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            $${(item.price * item.quantity).toFixed(2)} MXN
          </td>
        </tr>
      `).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Compra</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header con Logo -->
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                🛒 E-Shop - ITT Tepic
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">
                Servicios Web - Instituto Tecnológico de Tepic
              </p>
            </div>

            <!-- Contenido Principal -->
            <div style="padding: 40px 20px;">
              
              <!-- Saludo -->
              <h2 style="color: #1f2937; margin: 0 0 10px 0;">
                ¡Gracias por tu compra, ${nombre || username}!
              </h2>
              <p style="color: #6b7280; margin: 0 0 30px 0; line-height: 1.6;">
                Tu pedido ha sido confirmado y está siendo procesado. A continuación encontrarás los detalles de tu compra.
              </p>

              <!-- Información del Pedido -->
              <div style="background-color: #fff8f3; border-left: 4px solid #ff6b35; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #ff6b35; margin: 0 0 15px 0; font-size: 18px;">
                  📦 Información del Pedido
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Número de Pedido:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">#${id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Fecha:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right;">
                      ${new Date(createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Estado:</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                        PAGADO
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Productos -->
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px;">
                🛍️ Productos Ordenados
              </h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Producto</th>
                    <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Cantidad</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsList}
                </tbody>
              </table>

              <!-- Total -->
              <div style="background-color: #fff8f3; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 16px;">Subtotal:</td>
                    <td style="padding: 8px 0; text-align: right; font-size: 16px;">$${total.toFixed(2)} MXN</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 16px;">Envío:</td>
                    <td style="padding: 8px 0; text-align: right; font-size: 16px;">Gratis</td>
                  </tr>
                  <tr style="border-top: 2px solid #ff6b35;">
                    <td style="padding: 16px 0 0 0; color: #1f2937; font-size: 20px; font-weight: bold;">Total:</td>
                    <td style="padding: 16px 0 0 0; text-align: right; color: #ff6b35; font-size: 24px; font-weight: bold;">
                      $${total.toFixed(2)} MXN
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Información Adicional -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">
                  ℹ️ Información Importante
                </h3>
                <p style="color: #1e40af; margin: 0; line-height: 1.6; font-size: 14px;">
                  Tu pedido será procesado en las próximas 24-48 horas. Recibirás una notificación cuando tu pedido sea enviado.
                </p>
              </div>

              <!-- Botón CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5174/orders/${id}" 
                   style="background-color: #ff6b35; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Ver Detalle del Pedido
                </a>
              </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 30px 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                Instituto Tecnológico de Tepic
              </p>
              <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                Materia: Servicios Web
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 12px;">
                Este es un proyecto académico del ITT Tepic
              </p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                © 2024 E-Shop ITT Tepic. Todos los derechos reservados.
              </p>
            </div>

          </div>
        </body>
        </html>
      `;

      const msg = {
        to: correo,
        from: {
          email: 'noreply@ittepic.edu.mx', // Cambia esto por tu email verificado en SendGrid
          name: 'E-Shop ITT Tepic'
        },
        subject: `✅ Confirmación de Pedido #${id} - E-Shop ITT Tepic`,
        text: `Gracias por tu compra, ${nombre || username}. Tu pedido #${id} ha sido confirmado. Total: $${total.toFixed(2)} MXN`,
        html: htmlContent,
      };

      await sgMail.send(msg);
      console.log('✅ Correo de confirmación enviado a:', correo);
      return { success: true };
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      if (error.response) {
        console.error('Detalle del error:', error.response.body);
      }
      return { success: false, error: error.message };
    }
  },

  /**
   * Enviar correo de bienvenida al registrarse
   * @param {Object} userData - Datos del usuario
   */
  sendWelcomeEmail: async (userData) => {
    try {
      const { correo, nombre, username } = userData;

      const msg = {
        to: correo,
        from: {
          email: 'semiroblesza@ittepic.edu.mx',
          name: 'E-Shop ITT Tepic'
        },
        subject: '🎉 ¡Bienvenido a E-Shop ITT Tepic!',
        text: `Hola ${nombre || username}, bienvenido a E-Shop ITT Tepic. Tu cuenta ha sido creada exitosamente.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">¡Bienvenido a E-Shop!</h1>
            </div>
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937;">Hola ${nombre || username},</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                Gracias por registrarte en E-Shop del Instituto Tecnológico de Tepic.
              </p>
              <p style="color: #6b7280; line-height: 1.6;">
                Tu cuenta ha sido creada exitosamente. Ahora puedes explorar nuestro catálogo y realizar compras.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5174/products" 
                   style="background-color: #ff6b35; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Explorar Productos
                </a>
              </div>
            </div>
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © 2024 E-Shop ITT Tepic - Servicios Web
              </p>
            </div>
          </div>
        `,
      };

      await sgMail.send(msg);
      console.log('✅ Correo de bienvenida enviado a:', correo);
      return { success: true };
    } catch (error) {
      console.error('❌ Error al enviar correo de bienvenida:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;
