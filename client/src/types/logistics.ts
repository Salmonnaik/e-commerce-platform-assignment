export type ShipmentStatus =
  | 'PENDING'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED';

export interface TrackingEvent {
  status: ShipmentStatus;
  location?: string;
  description: string;
  timestamp: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  events?: TrackingEvent[];
}
