import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    const processSuccess = async () => {
      try {
        await clearCart();
        setLoading(false);
      } catch (error) {
        console.error('Error al limpiar carrito:', error);
        setLoading(false);
      }
    };

    processSuccess();
  }, [clearCart]);

  if (loading) {
    return <LoadingSpinner message="Procesando tu compra..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Compra Exitosa! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Tu pago ha sido procesado correctamente
          </p>
          
          {sessionId && (
            <p className="text-sm text-gray-500 mb-6">
              ID de sesión: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-4">
            {/* Email Confirmation */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <svg 
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  📧 Confirmación Enviada
                </h3>
                <p className="text-sm text-gray-600">
                  Hemos enviado un correo electrónico con los detalles de tu compra y tu número de pedido.
                </p>
              </div>
            </div>

            {/* Order Processing */}
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <svg 
                className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  🚚 Pedido en Proceso
                </h3>
                <p className="text-sm text-gray-600">
                  Tu pedido será procesado en las próximas 24-48 horas. Te notificaremos cuando sea enviado.
                </p>
              </div>
            </div>

            {/* Cart Cleared */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
              <svg 
                className="w-6 h-6 text-primary flex-shrink-0 mt-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  🛒 Carrito Limpiado
                </h3>
                <p className="text-sm text-gray-600">
                  Tu carrito ha sido vaciado. ¡Puedes seguir comprando cuando quieras!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full btn-primary"
          >
            Ver Mis Pedidos
          </button>
          
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-white text-primary border-2 border-primary hover:bg-orange-50 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Seguir Comprando
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Ir al Inicio
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ¿Tienes alguna pregunta sobre tu pedido?
          </p>
          <p className="text-sm text-gray-600 font-medium mt-1">
            Revisa tu correo electrónico o visita tu historial de pedidos
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
