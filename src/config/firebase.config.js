
const admin = require('firebase-admin');
const path = require('path');

// Intentar cargar desde archivo o variables de entorno
try {
  let credential;
  
  // Primero intenta cargar desde archivo
  const serviceAccountPath = path.join(__dirname, '..', '..', 'serviceAccountKey.json');
  try {
    const serviceAccount = require(serviceAccountPath);
    credential = admin.credential.cert(serviceAccount);
    console.log('Firebase Admin inicializado con archivo de credenciales');
  } catch (fileError) {
    // Si no existe el archivo, intenta con variables de entorno
    if (process.env.FIREBASE_PROJECT_ID) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      });
      console.log('Firebase Admin inicializado con variables de entorno');
    } else {
      throw new Error('No se encontraron credenciales de Firebase. Descarga serviceAccountKey.json o configura las variables de entorno.');
    }
  }

  admin.initializeApp({ credential });
  
  const db = admin.firestore();
  console.log('Firestore inicializado correctamente.');
  
  module.exports = { db, admin };
} catch (error) {
  console.error('Error al inicializar Firebase Admin:', error.message);
  console.log('\n⚠️  SOLUCIÓN: Descarga el archivo serviceAccountKey.json desde:');
  console.log('https://console.firebase.google.com/project/projectfinal-d7257/settings/serviceaccounts/adminsdk');
  console.log('Y colócalo en la raíz del proyecto.\n');
  process.exit(1);
}
