
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
      }

      const user = await User.createUser({ username, password });
      res.status(201).json({ message: 'Usuario registrado exitosamente.', user });
    } catch (error) {
      if (error.message.includes('ya existe')) {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error en el servidor al registrar el usuario.', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ 
        message: 'Login exitoso.',
        token 
      });

    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor al intentar iniciar sesión.', error: error.message });
    }
  },
};

module.exports = authController;
