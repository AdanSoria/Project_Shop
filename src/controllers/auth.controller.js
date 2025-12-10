
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  async register(req, res) {
    try {
      console.log('📝 Intentando registrar usuario:', req.body.username);
      const { username, password, nombre, domicio, postal, correo, rfc, razon_social, id_factura, rol } = req.body;

      const user = await User.createUser({ username, password, nombre, domicio, postal, correo, rfc, razon_social, id_factura, rol });
      console.log('✅ Usuario registrado exitosamente:', user.username);
      res.status(201).json({ message: 'Usuario registrado exitosamente.', user });
    } catch (error) {
      console.error('❌ Error en register:', error.message);
      if (error.message.includes('ya existe') || error.message.includes('requeridos') || error.message.includes('Firebase Auth')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error en el servidor al registrar el usuario.', error: error.message });
    }
  },

  async login(req, res) {
    try {
      console.log('🔐 Intentando login:', req.body.username);
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        console.log('❌ Usuario no encontrado:', username);
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      console.log('🔍 Usuario encontrado, verificando contraseña...');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Contraseña incorrecta');
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ Login exitoso:', username);
      res.status(200).json({ 
        message: 'Login exitoso.',
        token,
        user: {
          id: user.id,
          username: user.username,
          correo: user.correo,
          rol: user.rol
        }
      });

    } catch (error) {
      console.error('❌ Error en login:', error.message);
      res.status(500).json({ message: 'Error en el servidor al intentar iniciar sesión.', error: error.message });
    }
  },
};

module.exports = authController;
