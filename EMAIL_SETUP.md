# 📧 Configuración de Emails - E-Shop ITT Tepic

## Descripción
Sistema de notificaciones por correo electrónico usando SendGrid para enviar confirmaciones de compra y correos de bienvenida.

## ✅ Características Implementadas

### 1. Correo de Confirmación de Compra
Cuando un usuario completa una compra, automáticamente recibe un correo con:
- Número de pedido único
- Fecha y hora de la compra
- Lista detallada de productos comprados
- Cantidad y subtotales de cada producto
- Total pagado
- Estado del pedido (PAGADO)
- Enlace para ver el detalle del pedido
- Diseño responsive con colores naranja del ITT Tepic

### 2. Correo de Bienvenida
Cuando un usuario se registra, puede recibir un correo de bienvenida con:
- Saludo personalizado
- Enlace a la página de productos
- Diseño acorde al tema naranja de la aplicación

## 🔧 Configuración de SendGrid

### 1. Obtener API Key de SendGrid
1. Crea una cuenta en [SendGrid](https://sendgrid.com/)
2. Ve a **Settings > API Keys**
3. Crea una nueva API Key con permisos de "Mail Send"
4. Copia la API Key (solo se muestra una vez)

### 2. Configurar Remitente Verificado
**IMPORTANTE:** SendGrid requiere que verifiques el email remitente antes de poder enviar correos.

1. Ve a **Settings > Sender Authentication**
2. Opción A: **Verificar un Dominio** (recomendado para producción)
   - Verifica tu dominio completo
   - Agrega los registros DNS que SendGrid te proporciona
   
3. Opción B: **Verificar un Email Individual** (más rápido para desarrollo)
   - Agrega tu email personal (ej: `tucorreo@gmail.com`)
   - Revisa tu bandeja de entrada y verifica el email
   - Usa este email como remitente en `email.service.js`

### 3. Actualizar el Email Remitente

Abre el archivo `src/services/email.service.js` y cambia el email remitente:

```javascript
from: {
  email: 'tu-email-verificado@gmail.com', // ⚠️ CAMBIA ESTO
  name: 'E-Shop ITT Tepic'
}
```

**Nota:** El email debe estar verificado en SendGrid, de lo contrario recibirás errores 403.

### 4. Variables de Entorno

Tu archivo `.env` ya debe tener:
```env
SENDGRID_API_KEY=SG.tu_api_key_aqui
FRONTEND_URL=http://localhost:5174
```

## 📂 Archivos Modificados

### Nuevo Archivo Creado:
- `src/services/email.service.js` - Servicio de envío de emails con SendGrid

### Archivos Actualizados:
- `src/controllers/order.controller.js` - Envía email después de crear orden con cargo directo
- `src/controllers/webhook.controller.js` - Envía email después de checkout de Stripe exitoso

## 🚀 Uso del Sistema

### Envío Automático
Los correos se envían automáticamente en estos casos:

1. **Pago Directo (Direct Charge)**
   - Cuando un usuario paga con `POST /api/orders/charge`
   - Se crea la orden y se envía el email inmediatamente

2. **Checkout de Stripe**
   - Cuando un usuario completa el checkout de Stripe
   - El webhook `checkout.session.completed` crea la orden
   - Se envía el email automáticamente

### Envío Manual (Opcional)
Puedes usar el servicio en otros controladores:

```javascript
const emailService = require('../services/email.service');
const User = require('../models/user.model');

// Ejemplo: Enviar email de bienvenida al registrar
const user = await User.findById(userId);
await emailService.sendWelcomeEmail(user);

// Ejemplo: Enviar confirmación de orden
await emailService.sendOrderConfirmation(orderData, userData);
```

## 📧 Estructura del Email de Confirmación

El email incluye:
- **Header:** Logo y título con gradiente naranja
- **Saludo:** Personalizado con el nombre del usuario
- **Info del Pedido:** Número, fecha y estado
- **Tabla de Productos:** Lista con cantidades y subtotales
- **Total:** Subtotal, envío y total final
- **Información Adicional:** Tiempos de procesamiento
- **Botón CTA:** "Ver Detalle del Pedido" que redirige a la página de la orden
- **Footer:** Información del ITT Tepic

## 🎨 Personalización del Email

Para modificar el diseño del email, edita `src/services/email.service.js`:

1. **Colores:** Cambia los valores hexadecimales (#ff6b35, #ff8c42, etc.)
2. **Logo:** Puedes agregar una imagen del logo en el header
3. **Textos:** Modifica los mensajes y descripciones
4. **Footer:** Actualiza la información de contacto

## ⚠️ Manejo de Errores

El sistema está diseñado para NO fallar la orden si el email falla:

```javascript
try {
  await emailService.sendOrderConfirmation(order, user);
  console.log('✅ Email enviado');
} catch (emailError) {
  // La orden YA se creó exitosamente
  console.error('⚠️ Error al enviar email:', emailError.message);
}
```

Esto asegura que:
- ✅ La orden siempre se crea
- ✅ El pago siempre se procesa
- ⚠️ Si falla el email, solo se registra el error

## 🧪 Probar el Sistema

### 1. Verificar Configuración
```bash
# Verificar que SendGrid está instalado
npm list @sendgrid/mail

# Verificar que el .env tiene la API Key
cat .env | grep SENDGRID
```

### 2. Realizar una Compra de Prueba
1. Inicia el backend: `npm start`
2. Inicia el frontend: `cd src/frontend && npm run dev`
3. Agrega productos al carrito
4. Completa una compra
5. Revisa tu email (el registrado en el usuario)

### 3. Revisar los Logs
```bash
# Busca estos mensajes en la consola del backend:
✅ Email de confirmación enviado para orden: 12345
# o
⚠️ Error al enviar email (orden creada exitosamente): mensaje de error
```

## 🐛 Solución de Problemas

### Error: "Forbidden"
**Causa:** El email remitente no está verificado en SendGrid
**Solución:** Verifica el email en SendGrid Settings > Sender Authentication

### Error: "API key does not start with SG"
**Causa:** La API Key en .env no es válida
**Solución:** Genera una nueva API Key en SendGrid

### No se envían emails pero no hay error
**Causa:** El usuario no tiene email configurado
**Solución:** Verifica que el campo `correo` existe en el usuario de Firestore

### Email llega a spam
**Causa:** Email no verificado o dominio sin autenticación SPF/DKIM
**Solución:** Verifica tu dominio completo en SendGrid con registros DNS

## 📝 Notas Adicionales

- Los emails se envían de forma **asíncrona** para no bloquear la respuesta al usuario
- Se recomienda usar una **cola de emails** (como Bull o RabbitMQ) en producción
- Para **volumen alto** de emails, considera usar templates de SendGrid
- En **desarrollo**, puedes usar servicios como [Mailtrap](https://mailtrap.io/) para capturar los emails

## 🔒 Seguridad

- ✅ La API Key está en `.env` (nunca la subas a Git)
- ✅ El `.gitignore` incluye `.env`
- ✅ Los emails solo se envían después de pagos exitosos
- ✅ Los errores de email no afectan las órdenes

## 📚 Recursos

- [Documentación de SendGrid](https://docs.sendgrid.com/)
- [SendGrid Node.js Quickstart](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)
- [Verificar Remitente](https://docs.sendgrid.com/ui/sending-email/sender-verification)

---

**Proyecto:** E-Shop ITT Tepic  
**Materia:** Servicios Web  
**Institución:** Instituto Tecnológico de Tepic  
**Actualizado:** Enero 2025
