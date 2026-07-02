/**
 * Order Success/Confirmation Page
 * Displays order confirmation, payment details, and next steps
 * Supports both demo and real Stripe payments
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { ROUTES } from '../constants/routes';

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string;
    };
  }>;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  payment: Array<{
    id: string;
    paymentIntentId: string;
    status: string;
  }>;
  shipment?: Array<{
    id: string;
    trackingNumber: string;
    status: string;
    estimatedDelivery: string;
  }>;
}

interface DemoData {
  orderId: string;
  paymentId: string;
  trackingId: string;
  invoiceNumber: string;
  estimatedDelivery: string;
  isDemoPayment?: boolean;
}

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [demoData, setDemoData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!orderId) {
          // Try to get the latest order from session storage
          const storedOrderId = sessionStorage.getItem('lastOrderId');
          if (!storedOrderId) {
            setError('No order found. Redirecting to orders page...');
            setTimeout(() => navigate(ROUTES.orders), 2000);
            return;
          }

          console.log('[OrderSuccess] Fetching order from session:', storedOrderId);
          const response = await ordersApi.getOrder(storedOrderId);
          setOrder(response.data.data);

          // Get demo data if available
          const storedDemoData = sessionStorage.getItem('demoPaymentData');
          if (storedDemoData) {
            setDemoData(JSON.parse(storedDemoData));
          }
        } else {
          console.log('[OrderSuccess] Fetching order:', orderId);
          const response = await ordersApi.getOrder(orderId);
          setOrder(response.data.data);

          // Try to get demo data
          const storedDemoData = sessionStorage.getItem(`demoData_${orderId}`);
          if (storedDemoData) {
            setDemoData(JSON.parse(storedDemoData));
          }
        }
      } catch (err: any) {
        console.error('[OrderSuccess] Error fetching order:', err);
        setError((err as Error).message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  // Generate and download invoice
  const handleDownloadInvoice = async () => {
    if (!order) return;

    try {
      setDownloadingInvoice(true);
      console.log('[OrderSuccess] Generating invoice for order:', order.orderNumber);

      // Try to call the invoice API
      try {
        const response = await ordersApi.getOrderInvoice(order.id);
        
        // If it's a PDF blob
        if (response.data instanceof Blob) {
          const url = URL.createObjectURL(response.data);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Invoice-${order.orderNumber}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
        } else if (typeof response.data === 'string' && response.data.startsWith('data:')) {
          // If it's a data URI
          const link = document.createElement('a');
          link.href = response.data;
          link.download = `Invoice-${order.orderNumber}.pdf`;
          link.click();
        }
      } catch (apiError) {
        // Fallback: Generate a simple text invoice
        console.warn('[OrderSuccess] Could not get invoice from API, generating local copy');
        
        const invoiceContent = `
INVOICE
=====================================

Invoice Number: ${demoData?.invoiceNumber || order.id}
Order Number: ${order.orderNumber}
Date: ${new Date().toLocaleDateString()}

=====================================
BILLING & SHIPPING ADDRESS:
=====================================
${order.shippingAddress.fullName}
${order.shippingAddress.addressLine1}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
Phone: ${order.shippingAddress.phone}

=====================================
ORDER ITEMS:
=====================================
${order.items.map((item) => `${item.product.name} x${item.quantity} @ $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`).join('\n')}

=====================================
ORDER SUMMARY:
=====================================
Subtotal: $${order.subtotal.toFixed(2)}
Tax (2%): $${order.tax.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
=====================================
TOTAL: $${order.total.toFixed(2)}

Payment Status: ${order.payment[0]?.status || 'Pending'}
Order Status: ${order.status}
${demoData?.trackingId ? `\nTracking ID: ${demoData.trackingId}` : ''}
${demoData?.estimatedDelivery ? `Estimated Delivery: ${demoData.estimatedDelivery}` : ''}

Thank you for your purchase!
        `.trim();

        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${order.orderNumber}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('[OrderSuccess] Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (loading) return <Loader />;

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <Button onClick={() => navigate(ROUTES.products)}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful</h1>
          {/* DEMO PAYMENT MODE - Show demo indicator */}
          {demoData?.isDemoPayment && (
            <p className="text-sm bg-blue-100 text-blue-700 inline-block px-3 py-1 rounded mb-4">
              🧪 Demo Payment Mode
            </p>
          )}
          <p className="text-xl text-gray-600">Thank you for your purchase.</p>
        </div>

        {/* Order Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Order Info */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b pb-3">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                </div>

                {/* DEMO PAYMENT MODE - Display demo data */}
                {demoData && (
                  <>
                    <div className="flex justify-between items-start border-b pb-3">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-mono text-sm text-gray-900">{demoData.paymentId}</span>
                    </div>
                    <div className="flex justify-between items-start border-b pb-3">
                      <span className="text-gray-600">Tracking ID:</span>
                      <span className="font-mono font-semibold text-blue-600">{demoData.trackingId}</span>
                    </div>
                    <div className="flex justify-between items-start border-b pb-3">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-mono text-sm text-gray-900">{demoData.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Est. Delivery:</span>
                      <span className="font-semibold text-gray-900">{demoData.estimatedDelivery}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded text-sm text-gray-700">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Items & Total */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      <p className="font-semibold text-gray-900 mt-1">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${(order.total - (order.total * 0.02) - 5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (2%):</span>
                  <span>${(order.total * 0.02).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>$5.00</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 bg-gray-50 p-4 rounded">
                <span>Total Paid:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => {
              const trackingId = demoData?.trackingId || order.shipment?.[0]?.trackingNumber;
              if (trackingId) {
                navigate(ROUTES.tracking(trackingId));
              }
            }}
            disabled={!demoData?.trackingId && !order.shipment?.[0]?.trackingNumber}
          >
            📦 Track Order
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate(ROUTES.products)}
          >
            🛍️ Continue Shopping
          </Button>
          <Button
            onClick={handleDownloadInvoice}
            disabled={downloadingInvoice}
          >
            {downloadingInvoice ? '⏳ Generating...' : '📥 Download Invoice'}
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-sm text-blue-700">
          <p>
            A confirmation email has been sent to your registered email address with full order details.
          </p>
        </div>
      </div>
    </div>
  );
}
