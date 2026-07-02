# Enterprise E-Commerce Setup & Testing Guide

## Prerequisites Installed ✅
- Node.js
- Docker (v29.2.0)
- npm
- Git

## Quick Start

### 1. Start Databases with Docker

```bash
cd d:\Herdsman\enterprise-ecommerce
docker-compose up -d
```

This starts:
- **PostgreSQL 16** on port 5432
  - User: `ecommerce`
  - Password: `ecommerce123`
  - Database: `enterprise_ecommerce`

- **MongoDB** on port 27017
  - Database: `enterprise-ecommerce`

**Status Check:**
```bash
docker ps
docker-compose logs
```

### 2. Initialize Database Schema

```bash
cd server
npx prisma migrate deploy
npx prisma db seed
```

### 3. Start Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
✅ Prisma (PostgreSQL) connected successfully
✅ MongoDB connected successfully  
✅ Server running on port 5000
```

### 4. Start Frontend Application

```bash
cd client
npm run dev
```

Access at: **http://localhost:5173**

### 5. Test Payment Flow

1. **Add Products to Cart**
   - Browse products at http://localhost:5173/products
   - Add items to cart

2. **Go to Checkout**
   - Click Cart → Checkout
   - Fill in shipping address (all fields required)

3. **Enter Card Details**
   - **Test Card:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., 12/25)
   - **CVV:** Any 3 digits (e.g., 123)

4. **Complete Payment**
   - Click "Pay with Card"
   - See order confirmation page
   - Download invoice
   - View in Orders page

## Test Card Numbers

| Card | Status | Purpose |
|------|--------|---------|
| 4242 4242 4242 4242 | ✅ Success | Test successful payments |
| 4000 0000 0000 0002 | ❌ Decline | Test payment failure |
| 5555 5555 5555 4444 | ✅ Success | Alternative success test |
| 378282246310005 | ✅ Success | Amex test card |

## Useful Commands

### Docker Management
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f postgres
docker-compose logs -f mongodb

# Check container status
docker ps
docker ps -a
```

### Database Management
```bash
# Connect to PostgreSQL
docker exec -it enterprise-ecommerce-postgres psql -U ecommerce -d enterprise_ecommerce

# Connect to MongoDB
docker exec -it enterprise-ecommerce-mongodb mongosh enterprise-ecommerce

# Reset database
docker-compose down -v
docker-compose up -d
npx prisma migrate deploy
```

### Application Management
```bash
# Frontend
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build

# Backend
npm run dev       # Start dev server
npm run build     # Build TypeScript
npm run start     # Start production server
```

## Stripe Configuration

Your frontend `.env` already has:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890123456789012345
```

Your backend `.env` has:
```
STRIPE_SECRET_KEY=sk_test_51234567890123456789012345
STRIPE_WEBHOOK_SECRET=whsec_test_123456789
```

**Note:** In demo mode, actual Stripe calls are mocked. Check `DEMO_PAYMENT=true` in `.env`

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     Client (React + Vite)               │
│     http://localhost:5173               │
│  - Checkout with Stripe Elements        │
│  - Order confirmation                   │
│  - Order history                        │
└──────────────┬──────────────────────────┘
               │ API Calls
               ▼
┌─────────────────────────────────────────┐
│     Backend (Node.js + Express)         │
│     http://localhost:5000               │
│  - Payment processing                   │
│  - Order management                     │
│  - Seller payouts                       │
│  - Shipment booking                     │
└──────────┬──────────────────┬───────────┘
           │                  │
           ▼                  ▼
       MongoDB           PostgreSQL
       (Auth)            (Products,
       (Demo             Orders,
        Orders)          Payments)
```

## Common Issues & Solutions

### Issue: Port 5000 Already in Use
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: PostgreSQL Connection Failed
- **Cause:** PostgreSQL container not running
- **Solution:** `docker-compose up -d` and wait 30 seconds

### Issue: MongoDB Connection Failed  
- **Cause:** MongoDB container not running
- **Solution:** `docker-compose up -d`

### Issue: Stripe Card Element Not Showing
- **Cause:** Missing VITE_STRIPE_PUBLISHABLE_KEY
- **Solution:** Check `client/.env` has the key

### Issue: Demo Payment Not Working
- **Cause:** Backend returned error
- **Solution:** Check backend logs for Prisma errors

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product details

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List user orders
- `GET /api/v1/orders/:id` - Get order details

### Payments
- `POST /api/v1/payments/checkout` - Create payment intent
- `GET /api/v1/payments/:id` - Get payment details

## Environment Variables

### Client (`.env`)
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server (`.env`)
```
DATABASE_URL=postgresql://ecommerce:ecommerce123@localhost:5432/enterprise_ecommerce
MONGO_URI=mongodb://127.0.0.1:27017/enterprise-ecommerce
STRIPE_SECRET_KEY=sk_test_...
DEMO_PAYMENT=true
```

## Next Steps

1. ✅ Start Docker containers
2. ✅ Seed database with sample products
3. ✅ Test checkout flow with test card
4. ✅ Verify order confirmation
5. ✅ Download invoice
6. ✅ Check order history

## Support

For issues:
1. Check backend logs: `npm run dev` in server directory
2. Check frontend logs: Browser console (F12)
3. Check Docker logs: `docker-compose logs`
4. Check database connection: Verify containers are running
