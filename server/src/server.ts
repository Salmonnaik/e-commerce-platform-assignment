import mongoose from 'mongoose';
import app from './app';
import { SERVER, STRIPE } from './constants';
import logger from './config/logger';
import prisma from './config/database';

const startServer = async (): Promise<void> => {
  try {
    // Connect to Prisma (PostgreSQL) - optional, won't block server startup
    try {
      await prisma.$connect();
      logger.info('Prisma (PostgreSQL) connected successfully');
    } catch (prismaError) {
      logger.warn('Prisma (PostgreSQL) connection failed. Services using PostgreSQL will not work.', prismaError);
    }

    // Connect to MongoDB - required for auth
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/enterprise-ecommerce');
    logger.info('MongoDB connected successfully');

    app.listen(SERVER.PORT, () => {
      logger.info(`Server running on port ${SERVER.PORT}`);
      logger.info(`Environment: ${SERVER.NODE_ENV}`);
      logger.info(`Stripe secret key configured: ${Boolean(STRIPE.SECRET_KEY)}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
