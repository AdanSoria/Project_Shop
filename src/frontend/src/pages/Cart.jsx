import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import { TrashIcon, PlusIcon, MinusIcon } from '../components/Icons';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, total, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = useCart();
  const [productsDetails, setProductsDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProductsDetails();
  }, [cart.items]);

  const fetchProductsDetails = async () => {
    if (!cart.items || cart.items.length === 0) {
      setLoadingProducts(false);
      return;
    }

    try {
      setLoadingProducts(true);
      const details = {};
      
      for (const item of cart.items) {
        const product = await productService.getById(item.productId);
        details[item.productId] = product;
      }
      
      setProductsDetails(details);
    } catch (error) {
      console.error('Error al cargar detalles de productos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading || loadingProducts) {
    return <LoadingSpinner message="Cargando carrito..." />;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-gray-600">
            ¡Agrega algunos productos para comenzar!
          </p>
          <Link to="/products" className="mt-6 inline-block btn-primary">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
        <button
          onClick={clearCart}
          className="btn-danger flex items-center gap-2"
        >
          <TrashIcon className="h-5 w-5" />
          Vaciar Carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = productsDetails[item.productId];
            if (!product) return null;

            const itemTotal = product.price * item.quantity;

            return (
              <div key={item.productId} className="card flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        ${product.price.toFixed(2)} c/u
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-danger hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.productId)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.productId)}
                        disabled={item.quantity >= product.stock}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <span className="text-xl font-bold text-primary">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold mb-4">Resumen de Compra</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío:</span>
                <span>Calculado en checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary mb-3"
            >
              Proceder al Pago
            </button>

            <Link
              to="/products"
              className="block text-center btn-secondary"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
