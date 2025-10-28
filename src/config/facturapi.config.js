// When using require with libraries that have a default export, you may need to access the .default property
const Facturapi = require('facturapi').default || require('facturapi');

// Es importante cargar la clave de API desde las variables de entorno por seguridad
const facturapi = new Facturapi(process.env.KEY_FACTURAPI);

module.exports = facturapi;