
const { db, admin } = require('../config/firebase.config');
const bcrypt = require('bcryptjs');

const usersCollection = db.collection('users');

const User = {
  async createUser({ username, password, nombre, domicio, postal, correo, rfc, razon_social, id_factura, rol }) {
    if (!username || !password || !correo) {
        throw new Error('Nombre de usuario, contraseña y correo son requeridos.');
    }

    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new Error('El nombre de usuario ya existe.');
    }

    const existingEmail = await this.findByEmail(correo);
    if (existingEmail) {
        throw new Error('El correo electrónico ya existe.');
    }

    // Crear usuario en Firebase Authentication
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().createUser({
        email: correo,
        password: password,
        displayName: nombre || username,
      });
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new Error('El correo electrónico ya está registrado en Firebase Auth.');
      }
      throw new Error(`Error al crear usuario en Firebase Auth: ${error.message}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      uid: firebaseUser.uid, // ID de Firebase Auth
      username,
      password: hashedPassword,
      correo,
      nombre: nombre || null,
      domicio: domicio || null,
      postal: postal || null,
      rfc: rfc || null,
      razon_social: razon_social || null,
      id_factura: id_factura || null,
      rol: rol || 'cliente',
    };

    // Guardar en Firestore usando el UID de Firebase Auth como ID del documento
    await usersCollection.doc(firebaseUser.uid).set(newUser);

    return this.findById(firebaseUser.uid);
  },

  async findByUsername(username) {
    const snapshot = await usersCollection.where('username', '==', username).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    const userDoc = snapshot.docs[0];
    // Incluir password para verificación de login
    return { id: userDoc.id, ...userDoc.data() };
  },

  async findByEmail(correo) {
    const snapshot = await usersCollection.where('correo', '==', correo).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  },

  async findById(id) {
    const userDoc = await usersCollection.doc(id).get();
    if (!userDoc.exists) {
      return null;
    }
    // NO incluir password cuando se obtiene el perfil
    const { password, ...userData } = userDoc.data();
    return { id: userDoc.id, ...userData };
  },
};

module.exports = User;
