import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    domicio: '',
    postal: '',
    rfc: '',
    razon_social: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        nombre: data.nombre || '',
        correo: data.correo || '',
        domicio: data.domicio || '',
        postal: data.postal || '',
        rfc: data.rfc || '',
        razon_social: data.razon_social || '',
      });
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      toast.error('Error al cargar tu perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await userService.updateProfile(formData);
      toast.success('Perfil actualizado exitosamente');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(message);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="domicio"
                  value={formData.domicio}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Calle 123, Col. Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="postal"
                  value={formData.postal}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          {/* Datos Fiscales */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Datos Fiscales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RFC
                </label>
                <input
                  type="text"
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="XAXX010101000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razón Social
                </label>
                <input
                  type="text"
                  name="razon_social"
                  value={formData.razon_social}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Mi Empresa SA de CV"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Los datos fiscales son necesarios para generar facturas
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormData({
                  nombre: profile.nombre || '',
                  correo: profile.correo || '',
                  domicio: profile.domicio || '',
                  postal: profile.postal || '',
                  rfc: profile.rfc || '',
                  razon_social: profile.razon_social || '',
                });
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Account Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Información de la Cuenta</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Usuario:</span>
                <p className="font-medium">{user?.username}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Rol:</span>
                <p className="font-medium capitalize">{user?.rol}</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Nombre:</span>
                <p className="font-medium">{profile?.nombre || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Correo:</span>
                <p className="font-medium">{profile?.correo || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Dirección:</span>
                <p className="font-medium">{profile?.domicio || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Código Postal:</span>
                <p className="font-medium">{profile?.postal || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Fiscal Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Datos Fiscales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">RFC:</span>
                <p className="font-medium">{profile?.rfc || 'No especificado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Razón Social:</span>
                <p className="font-medium">{profile?.razon_social || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
