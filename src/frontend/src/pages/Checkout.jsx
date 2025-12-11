import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total } = useCart();
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    try {
      setLoading(true);
      const response = await orderService.createCheckout();
      
      if (response.url) {
        // Redirigir a Stripe Checkout
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Error al crear sesión de checkout:', error);
      toast.error('Error al procesar el pago');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Procesando pago..." />;
  }

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Resumen de tu Pedido</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Items en el carrito:</span>
              <span className="font-medium">{cart.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleStripeCheckout}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
              </svg>
              Pagar con Stripe
            </button>

            <p className="text-sm text-gray-500 text-center">
              Serás redirigido a la página segura de Stripe para completar tu pago
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Pago 100% Seguro</h3>
              <p className="text-sm text-gray-600">
                Tus datos están protegidos con encriptación SSL. No almacenamos información de tarjetas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
