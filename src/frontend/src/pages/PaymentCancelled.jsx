import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pago Cancelado
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Tu pago fue cancelado
          </p>
          
          <p className="text-sm text-gray-500">
            No se realizó ningún cargo a tu tarjeta
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-4">
            {/* Cart Preserved */}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  🛒 Tu Carrito Está Intacto
                </h3>
                <p className="text-sm text-gray-600">
                  Todos los productos siguen en tu carrito. Puedes intentar completar tu compra cuando estés listo.
                </p>
              </div>
            </div>

            {/* Help */}
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
              <svg 
                className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ¿Necesitas Ayuda?
                </h3>
                <p className="text-sm text-gray-600">
                  Si tuviste problemas con el proceso de pago, puedes intentarlo nuevamente o contactarnos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/cart')}
            className="w-full btn-primary"
          >
            Ver Mi Carrito
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
            Recuerda que puedes completar tu compra en cualquier momento
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
