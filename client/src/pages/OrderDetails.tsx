import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (id) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getOrder(id!);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await ordersApi.cancelOrder(id!);
      setShowCancelModal(false);
      fetchOrderDetails();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-gray-100 text-gray-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancel = order && ['PENDING', 'PAID'].includes(order.status);

  if (loading) {
    return <Loader />;
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="The order you're looking for doesn't exist"
      >
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </EmptyState>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="secondary"
        onClick={() => navigate('/orders')}
        className="mb-6"
      >
        ← Back to Orders
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>

        {order.shipment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <p className="text-sm text-gray-600">Tracking Number: {order.shipment.trackingNumber}</p>
            <p className="text-sm text-gray-600">Courier: {order.shipment.courierName}</p>
            {order.shipment.estimatedDelivery && (
              <p className="text-sm text-gray-600">
                Estimated Delivery: {new Date(order.shipment.estimatedDelivery).toLocaleDateString()}
              </p>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate(`/tracking/${order.shipment.trackingNumber}`)}
              className="mt-2"
            >
              Track Shipment
            </Button>
          </div>
        )}

        {order.shippingAddress && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-700">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-gray-600">{order.shippingAddress.country}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: ${Number(item.price).toFixed(2)}</p>
              </div>
              <p className="font-semibold text-lg">${Number(item.total).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>${Number(order.shipping).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>${Number(order.tax).toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${Number(order.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xl border-t pt-4">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {order.payment && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span>Stripe</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${order.payment.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'}`}>
                {order.payment.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span>${Number(order.payment.amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        {canCancel && (
          <Button
            variant="danger"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Order
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelling}
            >
              No, Keep Order
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
