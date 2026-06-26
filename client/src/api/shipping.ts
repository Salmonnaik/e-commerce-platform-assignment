import api from './axios';

export const shippingApi = {
  getShipment: (trackingNumber: string) => 
    api.get(`/v1/logistics/tracking/${trackingNumber}`),
  
  getShipmentByOrder: (orderId: string) => 
    api.get(`/v1/logistics/orders/${orderId}/shipment`),
  
  getTrackingHistory: (trackingNumber: string) => 
    api.get(`/v1/logistics/tracking/${trackingNumber}/history`),
};
