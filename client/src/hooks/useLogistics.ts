import { useCallback, useState } from 'react';
import { logisticsService } from '../services/logisticsService';
import { getErrorMessage } from '../utils/helpers';
import type { Shipment, TrackingEvent } from '../types/logistics';

export function useLogistics() {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [history, setHistory] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackShipment = useCallback(async (trackingNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await logisticsService.getShipment(trackingNumber);
      setShipment(response.data);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to track shipment');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrackingHistory = useCallback(async (trackingNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await logisticsService.getTrackingHistory(trackingNumber);
      setHistory(response.data);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to fetch tracking history');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShipmentByOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await logisticsService.getShipmentByOrder(orderId);
      setShipment(response.data);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to fetch shipment');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    shipment,
    history,
    loading,
    error,
    trackShipment,
    fetchTrackingHistory,
    fetchShipmentByOrder,
  };
}
