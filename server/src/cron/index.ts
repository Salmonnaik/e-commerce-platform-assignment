import cron from 'node-cron';
import { releaseEscrow, retryFailedPayouts } from '../services/sellerService';
import { syncShipments } from '../services/shippingService';
import { processEmailQueue } from '../services/emailService';
import logger from '../config/logger';

cron.schedule('* * * * *', async () => {
  try {
    logger.info('Running escrow release job');
    const result = await releaseEscrow();
    logger.info(`Escrow release completed: ${result.released} escrows released`);
  } catch (error) {
    logger.error('Escrow release job failed', error);
  }
});

cron.schedule('*/5 * * * *', async () => {
  try {
    logger.info('Running failed payout retry job');
    const result = await retryFailedPayouts();
    logger.info(`Payout retry completed: ${result.retried} payouts retried`);
  } catch (error) {
    logger.error('Payout retry job failed', error);
  }
});

cron.schedule('*/10 * * * *', async () => {
  try {
    logger.info('Running email queue processing job');
    const result = await processEmailQueue();
    logger.info(`Email queue processing completed: ${result.processed} emails sent`);
  } catch (error) {
    logger.error('Email queue processing job failed', error);
  }
});

cron.schedule('*/15 * * * *', async () => {
  try {
    logger.info('Running shipment sync job');
    const result = await syncShipments();
    logger.info(`Shipment sync completed: ${result.synced} shipments synced`);
  } catch (error) {
    logger.error('Shipment sync job failed', error);
  }
});

logger.info('Cron jobs scheduled');
