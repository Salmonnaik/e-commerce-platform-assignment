export interface ShippingRateRequest {
  originPincode: string;
  destinationPincode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface ShippingRateOption {
  courier: string;
  estimatedDays: number;
  shippingCost: number;
  service: string;
}

export interface ShipmentBookingResult {
  id: string;
  trackingNumber: string;
  awb?: string | null;
  shipmentId?: string | null;
  pickupId?: string | null;
  courierName?: string | null;
  shippingLabelUrl?: string | null;
  labelPdfUrl?: string | null;
  estimatedDelivery?: Date | null;
  status: string;
}

export interface TrackingWebhookPayload {
  tracking_number?: string;
  trackingNumber?: string;
  status?: string;
  location?: string;
  description?: string;
  timestamp?: string;
}
