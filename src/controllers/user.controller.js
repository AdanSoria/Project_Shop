const User = require('../models/user.model');

// @desc    Obtener perfil del usuario
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { db } = require('../config/firebase.config');
    const usersCollection = db.collection('users');
    
    // Obtener el documento del usuario
    const userDoc = await usersCollection.doc(req.user.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar solo los campos permitidos
    const allowedFields = ['nombre', 'domicio', 'postal', 'rfc', 'razon_social'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Actualizar en Firestore
    if (Object.keys(updates).length > 0) {
      await usersCollection.doc(req.user.id).update(updates);
    }

    // Obtener usuario actualizado
    const updatedUser = await User.findById(req.user.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
