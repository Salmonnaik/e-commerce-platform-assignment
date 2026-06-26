# Enterprise E-Commerce Platform

A full-featured multi-vendor e-commerce platform built with modern technologies, supporting sellers, customers, and admin roles with comprehensive payment, logistics, and payout management.

## Features

### Customer Features
- **Product Browsing**: Search, filter, and paginate through products
- **Product Details**: View detailed product information with image gallery
- **Shopping Cart**: Add/remove items, update quantities, view order summary
- **Secure Checkout**: Stripe-powered payment processing with shipping address management
- **Order Management**: View order history, track shipments, cancel orders
- **Profile Management**: Update personal information and account settings

### Seller Features
- **Dashboard**: Overview of sales, balance, and pending payouts
- **Product Management**: Create, update, delete products with inventory tracking
- **Order Management**: View and manage customer orders
- **Financial Management**: View ledger entries and payout history
- **Payout Requests**: Request payouts to linked bank accounts

### Admin Features
- **Dashboard**: Platform-wide analytics and statistics
- **User Management**: Manage customers and sellers
- **Seller Verification**: Approve or reject seller applications
- **Order Oversight**: View and manage all platform orders
- **Analytics**: Detailed platform performance metrics

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Payment**: Stripe API
- **Logistics**: Shiprocket integration
- **Email**: Nodemailer
- **Validation**: Zod
- **Logging**: Winston
- **Cron Jobs**: node-cron for scheduled tasks

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: TailwindCSS
- **Payment**: Stripe.js
- **Forms**: React Hook Form

## Project Structure

```
enterprise-ecommerce/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/            # API client modules
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   └── styles/         # Global styles
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models (Prisma)
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Request validation schemas
│   │   └── cron/           # Scheduled tasks
│   ├── package.json
│   └── tsconfig.json
├── prisma/
│   └── schema.prisma       # Database schema
├── docs/                   # Documentation
├── diagrams/               # Architecture diagrams
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Stripe account
- Shiprocket account (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd enterprise-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Use the PostgreSQL username and password from your local installation.
# Example for Windows install with default postgres user:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/enterprise_ecommerce?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
SHIPROCKET_EMAIL="your_shiprocket_email"
SHIPROCKET_PASSWORD="your_shiprocket_password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASSWORD="your_app_password"
CLIENT_URL="http://localhost:5173"
```

#### PostgreSQL login troubleshooting
If you see `password authentication failed for user "postgres"`, use one of these options:

Option 1: use the password from your original PostgreSQL install
- Username: `postgres`
- Password: the one you entered during installation
- Update `.env` with:
  ```env
  DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/enterprise_ecommerce?schema=public"
  ```

Option 2: reinstall PostgreSQL (easiest if you have no important local data)
1. Uninstall PostgreSQL.
2. Install PostgreSQL again.
3. Set username `postgres` and a new password such as `Admin123`.
4. Create the `enterprise_ecommerce` database.
5. Update `.env` with:
  ```env
  DATABASE_URL="postgresql://postgres:Admin123@localhost:5432/enterprise_ecommerce?schema=public"
  ```

Option 3: reset the `postgres` password
- If you cannot reinstall, reset the password using PostgreSQL's authentication configuration and `pg_hba.conf` procedure for Windows.
- Then update `.env` with the new password.

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Run the application:
```bash
# Development mode (both client and server)
npm run dev

# Server only
npm run dev:server

# Client only
npm run dev:client
```

6. Build for production:
```bash
npm run build
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/v1/products` - List products with filters
- `GET /api/v1/products/:id` - Get product details
- `GET /api/v1/products/search` - Search products
- `POST /api/v1/products` - Create product (Seller/Admin)
- `PUT /api/v1/products/:id` - Update product (Seller/Admin)
- `DELETE /api/v1/products/:id` - Delete product (Seller/Admin)
- `PATCH /api/v1/products/:id/inventory` - Update inventory (Seller/Admin)

### Categories
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/:id` - Get category details
- `POST /api/v1/categories` - Create category (Admin)
- `PUT /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)

### Orders
- `POST /api/v1/orders` - Create order (Customer)
- `GET /api/v1/orders` - List customer orders (Customer)
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders/:id/cancel` - Cancel order
- `GET /api/v1/orders/:id/invoice` - Get order invoice

### Payments
- `POST /api/v1/payments/checkout` - Create checkout session
- `POST /api/v1/payments/webhook` - Stripe webhook handler
- `GET /api/v1/payments/:id` - Get payment details

### Sellers
- `GET /api/v1/sellers/profile` - Get seller profile
- `PUT /api/v1/sellers/profile` - Update seller profile
- `GET /api/v1/sellers/products` - Get seller products
- `GET /api/v1/sellers/orders` - Get seller orders
- `GET /api/v1/sellers/balance` - Get seller balance
- `GET /api/v1/sellers/ledger` - Get seller ledger
- `GET /api/v1/sellers/payouts` - Get seller payouts
- `POST /api/v1/sellers/payouts` - Request payout

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - List users
- `GET /api/admin/sellers` - List sellers
- `POST /api/admin/sellers/:id/verify` - Verify seller
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/analytics` - Get analytics
- `PUT /api/admin/orders/:id/status` - Update order status

### Logistics
- `GET /api/v1/logistics/tracking/:trackingNumber` - Get shipment tracking
- `GET /api/v1/logistics/orders/:orderId/shipment` - Get order shipment
- `GET /api/v1/logistics/tracking/:trackingNumber/history` - Get tracking history

## Database Schema

The platform uses PostgreSQL with the following main entities:

- **User**: Customer, Seller, and Admin accounts
- **Product**: Product listings with inventory
- **Category**: Product categorization
- **Order**: Customer orders with items
- **Payment**: Payment transactions via Stripe
- **Shipment**: Shipping and tracking information
- **Seller**: Seller profiles and verification
- **SellerBalance**: Seller financial balances
- **SellerLedger**: Transaction history
- **Escrow**: Fund holding for seller payouts
- **Payout**: Seller payout requests
- **ShippingAddress**: Customer addresses

See `prisma/schema.prisma` for the complete schema.

## Payment Flow

1. Customer adds items to cart
2. Customer proceeds to checkout
3. Customer enters shipping information
4. Frontend requests `/api/v1/payments/checkout`
5. Backend validates order total, creates Stripe PaymentIntent, and returns `clientSecret`
6. Frontend uses Stripe Elements to confirm payment securely
7. Stripe sends webhook to `/api/v1/payments/webhook`
8. Backend verifies webhook signature and updates order status to `PAID`
9. Inventory and seller ledger are updated, escrow record is created, and shipment booking is triggered
10. Order transitions into shipment processing and seller funds are held until release

### Stripe Test Scenarios

- Success card: `4242 4242 4242 4242`, any future expiry date, any CVC, any postal code
- Declined card: `4000 0000 0000 9995`, any future expiry date, any CVC, any postal code

### Webhook Testing with Stripe CLI

1. Install Stripe CLI: `npm install -g stripe`
2. Authenticate: `stripe login`
3. Start webhook forwarding:
   `stripe listen --forward-to localhost:5000/api/v1/payments/webhook`
4. Trigger success event:
   `stripe trigger payment_intent.succeeded`
5. Trigger failure event:
   `stripe trigger payment_intent.payment_failed`

> The backend now verifies `Stripe-Signature` using the raw request body before processing webhook events.

## Seller Payout Flow

1. Seller earns revenue from sales
2. Funds held in escrow for delivery window (default 3 minutes)
3. After escrow period, funds move to available balance
4. Seller requests payout
5. System processes payout to seller's bank account
6. If failed, system retries with exponential backoff
7. Ledger tracks all transactions

## Cron Jobs

The system runs several scheduled tasks:

- **Escrow Release** (every minute): Releases funds from escrow after delivery window
- **Payout Retry** (every 5 minutes): Retries failed payout requests
- **Email Queue Processing** (every 10 minutes): Processes queued emails
- **Shipment Sync** (every 15 minutes): Syncs shipment status from logistics provider

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Idempotency keys for payment operations
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection via Helmet
- CORS configuration

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Management
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Running Cron Jobs Separately
```bash
npm run cron
```

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection string
- JWT secret
- Stripe keys
- Shiprocket credentials
- SMTP configuration
- CORS client URL

### Build Process
```bash
npm run build
```

### Starting the Server
```bash
npm start
```

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
