import mongoose from 'mongoose';
import app from './app';
import { SERVER } from './constants';
import logger from './config/logger';
import prisma from './config/database';

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/enterprise-ecommerce');
    logger.info('Database connected successfully');

    app.listen(SERVER.PORT, () => {
      logger.info(`Server running on port ${SERVER.PORT}`);
      logger.info(`Environment: ${SERVER.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
