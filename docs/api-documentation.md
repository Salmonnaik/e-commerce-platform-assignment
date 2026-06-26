# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "CUSTOMER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CUSTOMER"
    },
    "token": "jwt_token"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CUSTOMER"
    },
    "token": "jwt_token"
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "phone": "+1234567890"
  }
}
```

### Payments

#### Create Checkout
```http
POST /v1/payments/checkout
Authorization: Bearer <token>
Idempotency-Key: <unique_key>
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddressId": "uuid",
  "couponCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout created",
  "data": {
    "clientSecret": "pi_client_secret",
    "paymentIntentId": "pi_uuid",
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-123456",
      "status": "PENDING",
      "subtotal": 100.00,
      "tax": 2.00,
      "shipping": 5.00,
      "discount": 0.00,
      "total": 107.00,
      "items": [...],
      "payment": {...}
    }
  }
}
```

#### Webhook
```http
POST /v1/payments/webhook
Content-Type: application/json
Stripe-Signature: <signature>

{
  "id": "evt_uuid",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_uuid",
      "amount": 10700,
      "currency": "usd",
      "status": "succeeded"
    }
  }
}
```

**Response:**
```json
{
  "received": true
}
```

#### Get Payment
```http
GET /v1/payments/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment retrieved",
  "data": {
    "id": "uuid",
    "paymentIntentId": "pi_uuid",
    "amount": 107.00,
    "currency": "USD",
    "status": "COMPLETED",
    "order": {...}
  }
}
```

### Sellers

#### Create Seller
```http
POST /v1/sellers
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "My Store",
  "businessEmail": "store@example.com",
  "businessPhone": "+1234567890",
  "taxId": "123456789",
  "bankAccount": "1234567890",
  "bankName": "Chase Bank"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Seller account created",
  "data": {
    "id": "uuid",
    "businessName": "My Store",
    "balance": {
      "pending": 0.00,
      "available": 0.00,
      "locked": 0.00,
      "paid": 0.00
    }
  }
}
```

#### Get Sellers
```http
GET /v1/sellers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Sellers retrieved",
  "data": [...]
}
```

#### Get Seller Ledger
```http
GET /v1/sellers/:id/ledger
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Ledger retrieved",
  "data": [
    {
      "id": "uuid",
      "type": "EARNINGS",
      "amount": 85.50,
      "balance": 85.50,
      "description": "Order ORD-123456 earnings",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Payout
```http
POST /v1/sellers/:id/payouts
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payout created",
  "data": {
    "id": "uuid",
    "amount": 85.50,
    "status": "PROCESSING",
    "referenceId": "PYT-123456"
  }
}
```

### Logistics

#### Get Shipping Rates
```http
POST /v1/logistics/rates
Authorization: Bearer <token>
Content-Type: application/json

{
  "warehousePincode": "110001",
  "destinationPincode": "400001",
  "weight": 0.5,
  "length": 10,
  "width": 10,
  "height": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Shipping rates retrieved",
  "data": [
    {
      "courier": "FedEx",
      "shippingCost": 5.00,
      "estimatedDelivery": "3-5 days",
      "deliveryDays": 4
    }
  ]
}
```

#### Book Shipment
```http
POST /v1/logistics/book/:orderId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Shipment booked",
  "data": {
    "id": "uuid",
    "trackingNumber": "TRK-123456",
    "awb": "1234567890",
    "courierName": "FedEx",
    "shippingLabelUrl": "https://...",
    "estimatedDelivery": "2024-01-05T00:00:00Z"
  }
}
```

#### Tracking Webhook
```http
POST /v1/logistics/tracking-update
Content-Type: application/json

{
  "tracking_number": "TRK-123456",
  "status": "DELIVERED"
}
```

**Response:**
```json
{
  "received": true
}
```

#### Get Tracking
```http
GET /v1/logistics/:trackingNumber
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Tracking retrieved",
  "data": {
    "id": "uuid",
    "trackingNumber": "TRK-123456",
    "status": "DELIVERED",
    "courierName": "FedEx",
    "trackingHistory": [...],
    "order": {...}
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": []
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API is rate limited to 100 requests per 15 minutes per IP address.

## Idempotency

Payment checkout endpoints support idempotency to prevent duplicate processing. Include a unique `Idempotency-Key` header.
