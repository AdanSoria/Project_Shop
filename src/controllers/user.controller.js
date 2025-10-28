const User = require('../models/user.model');

// @desc    Obtener perfil del usuario
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // El middleware 'protect' ya nos da req.user, pero buscamos de nuevo para obtener datos frescos
    const user = await User.findById(req.user.id).select('-password');
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
    const user = await User.findById(req.user.id);

    if (user) {
      // Actualizar solo los campos permitidos
      user.name = req.body.name || user.name;
      user.lastName = req.body.lastName || user.lastName;
      user.address = req.body.address || user.address;
      user.rfc = req.body.rfc || user.rfc;
      // No permitimos cambiar el email o password aquí por simplicidad

      const updatedUser = await user.save();
      
      // Devolvemos el usuario sin la contraseña
      const userResponse = updatedUser.toObject();
      delete userResponse.password;

      res.json(userResponse);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
