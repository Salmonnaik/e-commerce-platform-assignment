/**
 * DEMO PAYMENT MODE - Enhanced Tracking Page
 * Shows order tracking status with timeline visualization
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shippingApi } from '../api/shipping';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { ROUTES } from '../constants/routes';

export default function Tracking() {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // DEMO PAYMENT MODE - Demo tracking statuses
  const demoTrackingStatuses = [
    { status: 'CONFIRMED', label: 'Order Confirmed', icon: '✓', timestamp: new Date() },
    {
      status: 'PROCESSING',
      label: 'Processing',
      icon: '📦',
      timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
    {
      status: 'PACKED',
      label: 'Packed',
      icon: '📦',
      timestamp: new Date(Date.now() + 6 * 60 * 60 * 1000),
    },
    {
      status: 'SHIPPED',
      label: 'Shipped',
      icon: '🚚',
      timestamp: new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      icon: '📍',
      timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      status: 'DELIVERED',
      label: 'Delivered',
      icon: '🎉',
      timestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    if (trackingNumber) {
      fetchTracking();
    }
  }, [trackingNumber]);

  const fetchTracking = async () => {
    setLoading(true);
    try {
      try {
        // Try to fetch real tracking data from API
        const response = await shippingApi.getShipment(trackingNumber!);
        setTracking(response.data.data);
      } catch (apiError) {
        // DEMO PAYMENT MODE - Fallback to demo tracking data
        console.log('Using demo tracking data');
        setTracking({
          trackingNumber: trackingNumber,
          status: 'SHIPPED',
          courierName: 'DEMO Courier',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          trackingHistory: demoTrackingStatuses.map((s) => ({
            status: s.label,
            timestamp: s.timestamp.toISOString(),
            description: `Order ${s.label.toLowerCase()}`,
            location: 'Demo Location',
          })),
          isDemoTracking: true,
        });
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch tracking information');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      PACKED: 'bg-yellow-100 text-yellow-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-gray-100 text-gray-800',
      IN_TRANSIT: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      CONFIRMED: '✓',
      PROCESSING: '📦',
      PACKED: '📦',
      SHIPPED: '🚚',
      OUT_FOR_DELIVERY: '📍',
      DELIVERED: '🎉',
      FAILED: '❌',
      RETURNED: '↩️',
      PENDING: '⏳',
      IN_TRANSIT: '🚚',
      PICKED_UP: '📦',
    };
    return icons[status] || '📦';
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Tracking Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate(ROUTES.products)}>Back to Products</Button>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Tracking not found"
          description="The tracking number you entered is invalid or not yet available"
        >
          <Button onClick={() => navigate(ROUTES.orders)}>View Orders</Button>
        </EmptyState>
      </div>
    );
  }

  // DEMO PAYMENT MODE - Determine current step
  const currentStatus = tracking.status || 'CONFIRMED';
  const currentIndex = demoTrackingStatuses.findIndex((s) => s.status === currentStatus);

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          {/* DEMO PAYMENT MODE - Demo indicator */}
          {tracking.isDemoTracking && (
            <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
              🧪 Demo Tracking Mode
            </div>
          )}
        </div>

        {/* Tracking Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Tracking Number</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">{tracking.trackingNumber}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(currentStatus)}`}>
              {getStatusIcon(currentStatus)} {currentStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Courier</p>
              <p className="text-lg font-semibold text-gray-900">{tracking.courierName || 'Processing'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-gray-900">
                {tracking.estimatedDelivery
                  ? new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'TBD'}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Delivery Timeline</h2>

          {/* DEMO PAYMENT MODE - Visual timeline */}
          <div className="relative">
            {demoTrackingStatuses.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.status} className="mb-8 last:mb-0">
                  {/* Timeline connector line */}
                  {index < demoTrackingStatuses.length - 1 && (
                    <div
                      className={`absolute left-6 top-16 w-0.5 h-12 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}

                  {/* Timeline dot and content */}
                  <div className="flex gap-4">
                    {/* Dot */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                            ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-bold text-lg ${
                            isCompleted
                              ? 'text-gray-900'
                              : isCurrent
                                ? 'text-blue-600'
                                : 'text-gray-500'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                            In Progress
                          </span>
                        )}
                        {isCompleted && index < currentIndex && (
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {step.timestamp.toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {tracking.trackingHistory && tracking.trackingHistory[index] && (
                        <>
                          {tracking.trackingHistory[index].description && (
                            <p className="text-gray-700 mb-1">
                              {tracking.trackingHistory[index].description}
                            </p>
                          )}
                          {tracking.trackingHistory[index].location && (
                            <p className="text-gray-500 text-sm">
                              📍 {tracking.trackingHistory[index].location}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => navigate(ROUTES.orders)}>📦 View All Orders</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.products)}>
            🛍️ Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
