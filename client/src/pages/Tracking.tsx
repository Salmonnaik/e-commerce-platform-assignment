import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shippingApi } from '../api/shipping';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function Tracking() {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trackingNumber) {
      fetchTracking();
    }
  }, [trackingNumber]);

  const fetchTracking = async () => {
    setLoading(true);
    try {
      const response = await shippingApi.getShipment(trackingNumber!);
      setTracking(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PICKED_UP: 'bg-blue-100 text-blue-800',
      IN_TRANSIT: 'bg-purple-100 text-purple-800',
      OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <Loader />;
  }

  if (!tracking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Tracking not found"
          description="The tracking number you entered is invalid"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Track Shipment</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">Tracking Number</h2>
            <p className="text-lg text-gray-600">{tracking.trackingNumber}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tracking.status)}`}>
            {tracking.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Courier</p>
            <p className="font-medium">{tracking.courierName || 'Processing'}</p>
          </div>
          <div>
            <p className="text-gray-500">Estimated Delivery</p>
            <p className="font-medium">
              {tracking.estimatedDelivery
                ? new Date(tracking.estimatedDelivery).toLocaleDateString()
                : 'TBD'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
        <div className="space-y-4">
          {tracking.trackingHistory && tracking.trackingHistory.length > 0 ? (
            tracking.trackingHistory.map((event: any, index: number) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-primary-600 rounded-full mt-2"></div>
                  {index < tracking.trackingHistory.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 ml-1.5"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.status}</p>
                  {event.description && (
                    <p className="text-sm text-gray-600">{event.description}</p>
                  )}
                  {event.location && (
                    <p className="text-sm text-gray-500">{event.location}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tracking history available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
