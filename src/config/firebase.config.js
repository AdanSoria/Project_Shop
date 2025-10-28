
const admin = require('firebase-admin');

// Asegúrate de que la ruta al archivo de credenciales es correcta.
// El archivo debe estar en la raíz del proyecto.
const path = require('path');
const serviceAccount = require(path.join(__dirname, '..', '..', 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('Firebase conectado y Firestore inicializado.');

module.exports = db;
