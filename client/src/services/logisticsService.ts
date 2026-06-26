import { shippingApi } from '../api/shipping';
import type { Shipment, TrackingEvent } from '../types/logistics';
import type { ApiResponse } from '../types/common';

export const logisticsService = {
  async getShipment(trackingNumber: string) {
    const response = await shippingApi.getShipment(trackingNumber);
    return response.data as ApiResponse<Shipment>;
  },

  async getShipmentByOrder(orderId: string) {
    const response = await shippingApi.getShipmentByOrder(orderId);
    return response.data as ApiResponse<Shipment>;
  },

  async getTrackingHistory(trackingNumber: string) {
    const response = await shippingApi.getTrackingHistory(trackingNumber);
    return response.data as ApiResponse<TrackingEvent[]>;
  },
};
