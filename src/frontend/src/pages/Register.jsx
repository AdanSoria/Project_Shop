import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    correo: '',
    nombre: '',
    domicio: '',
    postal: '',
    rfc: '',
    razon_social: '',
  });
  const [loading, setLoading] = useState(false);
  const [showFiscalData, setShowFiscalData] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const userData = {
      username: formData.username,
      password: formData.password,
      correo: formData.correo,
      nombre: formData.nombre || undefined,
      domicio: formData.domicio || undefined,
      postal: formData.postal || undefined,
      rfc: formData.rfc || undefined,
      razon_social: formData.razon_social || undefined,
    };

    const result = await register(userData);
    
    setLoading(false);
    
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Datos de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Usuario *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="usuario123"
                />
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico *
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre Completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="domicio" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  id="domicio"
                  name="domicio"
                  type="text"
                  value={formData.domicio}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="Calle 123, Col. Centro"
                />
              </div>

              <div>
                <label htmlFor="postal" className="block text-sm font-medium text-gray-700">
                  Código Postal
                </label>
                <input
                  id="postal"
                  name="postal"
                  type="text"
                  value={formData.postal}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          {/* Datos Fiscales (Opcional) */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Datos Fiscales (Opcional)</h3>
              <button
                type="button"
                onClick={() => setShowFiscalData(!showFiscalData)}
                className="text-sm text-primary hover:text-blue-700"
              >
                {showFiscalData ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showFiscalData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rfc" className="block text-sm font-medium text-gray-700">
                    RFC
                  </label>
                  <input
                    id="rfc"
                    name="rfc"
                    type="text"
                    value={formData.rfc}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="XAXX010101000"
                  />
                </div>

                <div>
                  <label htmlFor="razon_social" className="block text-sm font-medium text-gray-700">
                    Razón Social
                  </label>
                  <input
                    id="razon_social"
                    name="razon_social"
                    type="text"
                    value={formData.razon_social}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Mi Empresa SA de CV"
                  />
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              * Los datos fiscales son necesarios si deseas generar facturas de tus compras
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
