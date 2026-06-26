import { Router } from 'express';
import {
  getShippingRatesController,
  bookShipmentController,
  trackingWebhookController,
  getTrackingController,
  getOrderShipmentController,
  getShipmentHistoryController,
  getLabelController,
} from '../logistics/controllers/logisticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/rates', authenticate, getShippingRatesController);
router.post('/book/:orderId', authenticate, bookShipmentController);
router.post('/tracking-update', trackingWebhookController);
router.get('/order/:orderId', authenticate, getOrderShipmentController);
router.get('/history/:trackingNumber', authenticate, getShipmentHistoryController);
router.get('/label/:shipmentId', authenticate, getLabelController);
router.get('/:trackingNumber', authenticate, getTrackingController);

export default router;
