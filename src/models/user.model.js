
const db = require('../config/firebase.config');
const bcrypt = require('bcryptjs');

const usersCollection = db.collection('users');

const User = {
  async createUser({ username, password }) {
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new Error('El nombre de usuario ya existe.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUserRef = await usersCollection.add({
      username,
      password: hashedPassword,
      isAdmin: false, // Add isAdmin field
    });

    return this.findById(newUserRef.id);
  },

  async findByUsername(username) {
    const snapshot = await usersCollection.where('username', '==', username).limit(1).get();
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
    const { password, ...userData } = userDoc.data();
    return { id: userDoc.id, ...userData };
  },
};

module.exports = User;
