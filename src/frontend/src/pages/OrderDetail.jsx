import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { invoiceService } from '../services/invoiceService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [productsDetails, setProductsDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(id);
      setOrder(orderData);

      // Fetch product details
      const details = {};
      for (const item of orderData.items) {
        try {
          const product = await productService.getById(item.productId);
          details[item.productId] = product;
        } catch (error) {
          console.error(`Error fetching product ${item.productId}:`, error);
        }
      }
      setProductsDetails(details);
    } catch (error) {
      console.error('Error al cargar el pedido:', error);
      toast.error('Pedido no encontrado');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      setGeneratingInvoice(true);
      const response = await invoiceService.createInvoice(order.id);
      toast.success('Factura generada exitosamente');
      console.log('Invoice:', response.invoice);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al generar la factura';
      toast.error(message);
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando pedido..." />;
  }

  if (!order) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAGADO':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/orders" className="text-primary hover:text-blue-700 mb-4 inline-block">
          ← Volver a Mis Pedidos
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pedido #{order.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date(order.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Productos</h2>
        
        <div className="space-y-4">
          {order.items.map((item) => {
            const product = productsDetails[item.productId];
            const itemTotal = item.price * item.quantity;

            return (
              <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {product?.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {product?.name || 'Producto'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-primary">
                    ${itemTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      {order.paymentIntentId && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Información de Pago</h2>
          <p className="text-sm text-gray-600">
            ID de transacción: <span className="font-mono">{order.paymentIntentId}</span>
          </p>
        </div>
      )}

      {/* Invoice Button */}
      {order.status === 'PAGADO' && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Factura Fiscal</h3>
              <p className="text-sm text-gray-600">
                Genera tu factura fiscal para este pedido
              </p>
            </div>
            <button
              onClick={handleGenerateInvoice}
              disabled={generatingInvoice}
              className="btn-primary disabled:opacity-50"
            >
              {generatingInvoice ? 'Generando...' : 'Generar Factura'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
