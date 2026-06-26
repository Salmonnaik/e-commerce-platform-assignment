import { Router } from 'express';
import { createCheckoutController, webhookController, getPaymentController, refundPaymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { idempotencyCheck } from '../middleware/idempotency';

const router = Router();

router.post('/checkout', authenticate, idempotencyCheck, createCheckoutController);
router.post('/webhook', webhookController);
router.get('/:id', authenticate, getPaymentController);
router.post('/:id/refund', authenticate, refundPaymentController);

export default router;
