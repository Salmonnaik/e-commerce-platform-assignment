import { Router } from 'express';
import { getShippingRatesController, bookShipmentController, trackingWebhookController, getTrackingController, getLabelController } from '../controllers/logisticsController';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/rates', authenticate, getShippingRatesController);
router.post('/book/:orderId', authenticate, bookShipmentController);
router.post('/tracking-update', trackingWebhookController);
router.get('/:trackingNumber', authenticate, getTrackingController);
router.get('/label/:shipmentId', authenticate, getLabelController);

export default router;
