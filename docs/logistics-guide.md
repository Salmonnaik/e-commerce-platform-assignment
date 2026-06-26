# Logistics & Shipping Integration Guide

## Flow
1. Checkout completes successfully.
2. Payment success triggers automatic shipment booking.
3. The logistics provider returns shipment metadata including AWB, tracking number, and label URL.
4. Tracking webhook updates shipment progress and order status.
5. Background synchronization polls provider updates every 15 minutes.

## APIs
- POST /api/v1/logistics/rates
- POST /api/v1/logistics/book/:orderId
- POST /api/v1/logistics/tracking-update
- GET /api/v1/logistics/:trackingNumber
- GET /api/v1/logistics/order/:orderId
- GET /api/v1/logistics/history/:trackingNumber
- GET /api/v1/logistics/label/:shipmentId

## Sample Payloads
### Shipping Rate Request
```json
{
  "originPincode": "500001",
  "destinationPincode": "560001",
  "weight": 1.5,
  "length": 20,
  "width": 15,
  "height": 10
}
```

### Shipping Rate Response
```json
{
  "courier": "BlueDart",
  "estimatedDays": 3,
  "shippingCost": 120,
  "service": "Express"
}
```

### Shipment Booking Response
```json
{
  "trackingNumber": "TRK-12345",
  "awb": "1234567890",
  "courierName": "BlueDart",
  "shippingLabelUrl": "https://example.com/label"
}
```

### Tracking Webhook
```json
{
  "tracking_number": "TRK-12345",
  "status": "DELIVERED",
  "location": "Bengaluru",
  "description": "Delivered to recipient"
}
```
