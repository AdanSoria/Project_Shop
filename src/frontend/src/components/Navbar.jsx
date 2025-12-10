import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, UserIcon, LogoutIcon } from './Icons';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartItemsCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y Enlaces Principales */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/tec tepic.png" 
                alt="TEC Tepic Logo" 
                className="h-12 w-auto"
              />
              <span className="text-2xl font-bold text-primary">E-Shop</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Inicio
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Productos
              </Link>
              {isAdmin() && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Carrito y Usuario */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Carrito */}
                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-700 hover:text-primary transition-colors"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Dropdown de Usuario */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden md:block">{user?.username}</span>
                  </button>
                  
                  {/* Menú Desplegable */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mis Pedidos
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogoutIcon className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="btn-secondary"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
