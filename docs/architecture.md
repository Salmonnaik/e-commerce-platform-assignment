# Software Architecture

## Overview

The Enterprise E-Commerce Platform follows a clean architecture pattern with clear separation of concerns between the frontend and backend. The system is designed to be scalable, maintainable, and production-ready.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │  Store   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                            │                                │
│                            ▼                                │
│                      ┌─────────┐                           │
│                      │  API    │                           │
│                      └────┬────┘                           │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTP/REST
┌───────────────────────────┼─────────────────────────────────┐
│                            ▼                                │
│                    ┌──────────────┐                          │
│                    │   Express    │                          │
│                    │   Server     │                          │
│                    └──────┬───────┘                          │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐                │
│         ▼                 ▼                 ▼                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Controllers │  │ Middleware │  │   Routes    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           ▼                                  │
│                    ┌──────────────┐                          │
│                    │   Services    │                          │
│                    └──────┬───────┘                          │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐                │
│         ▼                 ▼                 ▼                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Stripe    │  │  Shiprocket │  │   Email     │         │
│  │   Service   │  │   Service   │  │   Service   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           ▼                                  │
│                    ┌──────────────┐                          │
│                    │  Prisma ORM  │                          │
│                    └──────┬───────┘                          │
│                           │                                  │
│                           ▼                                  │
│                    ┌──────────────┐                          │
│                    │  PostgreSQL  │                          │
│                    └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Data Fetching**: React Query

### Directory Structure
```
client/
├── src/
│   ├── api/           # API layer with Axios
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # Zustand state management
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   └── styles/        # Global styles
```

### Key Patterns
- **Component Composition**: Reusable components for UI elements
- **State Management**: Zustand for global state (auth, cart)
- **API Layer**: Centralized API calls with Axios interceptors
- **Type Safety**: Full TypeScript coverage

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod
- **Logging**: Winston
- **Payment**: Stripe
- **Logistics**: Shiprocket

### Directory Structure
```
server/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── services/      # Business logic
│   ├── repositories/  # Data access layer
│   ├── middleware/    # Express middleware
│   ├── routes/        # API routes
│   ├── validators/    # Request validation
│   ├── utils/         # Utility functions
│   ├── cron/          # Background jobs
│   └── types/         # TypeScript types
```

### Clean Architecture Layers

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic
3. **Repositories**: Direct database access via Prisma
4. **Middleware**: Cross-cutting concerns (auth, validation, logging)

### Key Patterns
- **Dependency Injection**: Services injected into controllers
- **Middleware Chain**: Request processing pipeline
- **Error Handling**: Centralized error handler
- **Validation**: Zod schemas for request validation

## Data Flow

### Payment Flow
1. User initiates checkout from frontend
2. Frontend sends checkout request with cart items
3. Backend validates and calculates totals server-side
4. Backend creates Stripe Payment Intent
5. Frontend receives client secret and completes payment
6. Stripe webhook notifies backend of payment status
7. Backend updates order status and inventory
8. Backend triggers shipment booking

### Seller Payout Flow
1. Order payment succeeds
2. Backend calculates seller earnings (after commission)
3. Earnings held in escrow for 3 minutes
4. Cron job releases escrow to available balance
5. Seller requests payout
6. Backend executes payout to seller bank account
7. Ledger updated with transaction details

### Logistics Flow
1. Order marked as paid
2. Backend books shipment with Shiprocket
3. Shiprocket returns tracking number and AWB
4. Backend stores shipment details
5. Shiprocket webhook updates tracking status
6. Backend maps status to order status
7. Customer can track shipment in real-time

## Security Features

- **JWT Authentication**: Token-based authentication with refresh tokens
- **Role-Based Authorization**: Customer, Seller, Admin roles
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: Helmet security headers
- **CORS**: Configured for specific origins
- **Webhook Signature Verification**: Stripe webhook signature validation
- **Idempotency**: Prevent duplicate payment processing

## Background Jobs

### Cron Jobs
- **Escrow Release**: Every minute - releases held funds to available balance
- **Payout Retry**: Every 5 minutes - retries failed payouts
- **Email Queue**: Processes queued email notifications
- **Inventory Sync**: Syncs inventory across sellers

### Job Processing
- Uses node-cron for scheduling
- Winston logging for job execution
- Error handling with retry logic
- Transaction safety for data consistency
