# PROJECT_SHOP DES.SEV.WEB

Este es el backend para una aplicación de comercio electrónico construida con Node.js y Express. Utiliza Firebase Firestore como base de datos, Stripe para procesar pagos y FacturAPI para la generación de facturas.

## Características

*   Autenticación de usuarios con JSON Web Tokens (JWT).
*   Roles de usuario (cliente y administrador).
*   Gestión de productos (CRUD).
*   Carrito de compras.
*   Procesamiento de pedidos con Stripe.
*   Generación de facturas con FacturAPI.

## Requisitos Previos

*   Node.js (v14 o superior)
*   npm
*   Una cuenta de Firebase con Firestore habilitado.
*   Una cuenta de Stripe.
*   Una cuenta de FacturAPI.

## Instalación

1.  Clona este repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `serviceAccountKey.json` en la raíz del proyecto con tus credenciales de Firebase.
4.  Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:

    ```
    PORT=3000
    JWT_SECRET=tu_secreto_jwt
    KEY_FACTURAPI=tu_key_de_facturapi
    STRIPE_SECRET_KEY=tu_secret_key_de_stripe
    STRIPE_WEBHOOK_SECRET=tu_webhook_secret_de_stripe
    ```

## Uso

Para iniciar el servidor, ejecuta:

```bash
npm start
```

## Variables de Entorno

El archivo `.env` es necesario para configurar la aplicación.

*   `PORT`: El puerto en el que se ejecutará el servidor (por defecto: 3000).
*   `JWT_SECRET`: Una cadena secreta para firmar los JSON Web Tokens.
*   `KEY_FACTURAPI`: Tu clave de API de FacturAPI.
*   `STRIPE_SECRET_KEY`: Tu clave secreta de API de Stripe.
*   `STRIPE_WEBHOOK_SECRET`: El secreto del webhook de Stripe para verificar los eventos.
    PORT=3000
    JWT_SECRET=
    KEY_FACTURAPI=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=

## Estructura del Proyecto



```

├───.gitignore

├───package-lock.json

├───package.json

├───README.md

└───src

    ├───app.js                # Archivo principal de la aplicación

    ├───config                # Configuración de servicios externos

    ├───controllers           # Lógica de negocio

    ├───middleware            # Middlewares de Express

    ├───models                # Modelos de datos de Firestore

    └───routes                # Definición de rutas de la API

```



## API Endpoints



A continuación se detallan los endpoints de la API:



### Autenticación (`/api/auth`)



*   `POST /register`: Registrar un nuevo usuario.

*   `POST /login`: Iniciar sesión.



### Carrito (`/api/cart`)



*   `GET /`: Obtener el carrito del usuario.

*   `DELETE /`: Limpiar el carrito del usuario.

*   `POST /items`: Añadir un artículo al carrito.

*   `PUT /items/:productId`: Actualizar la cantidad de un artículo en el carrito.

*   `DELETE /items/:productId`: Eliminar un artículo del carrito.



### Facturas (`/api/invoices`)



*   `POST /`: Crear una nueva factura a partir de un pedido.



### Pedidos (`/api/orders`)



*   `GET /`: Obtener los pedidos del usuario.

*   `POST /checkout`: Crear un nuevo pedido.

*   `GET /:orderId`: Obtener un pedido por su ID.



### Productos (`/api/products`)



*   `GET /`: Obtener todos los productos.

*   `POST /`: Crear un nuevo producto (solo administradores).

*   `GET /:id`: Obtener un producto por su ID.

*   `PUT /:id`: Actualizar un producto (solo administradores).

*   `DELETE /:id`: Eliminar un producto (solo administradores).



### Usuario (`/api/user`)



*   `GET /me`: Obtener el perfil del usuario.

*   `PUT /me`: Actualizar el perfil del usuario.



### Webhook (`/api/webhook`)



*   `POST /stripe`: Manejar los webhooks de Stripe.
