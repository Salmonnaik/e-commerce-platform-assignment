import { Router } from 'express';
import {
  createOrderController,
  getCustomerOrdersController,
  getOrderController,
  cancelOrderController,
  getOrderInvoiceController,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Customer routes
router.post('/', authenticate, authorize('CUSTOMER'), createOrderController);
router.get('/', authenticate, authorize('CUSTOMER'), getCustomerOrdersController);
router.get('/:id', authenticate, getOrderController);
router.post('/:id/cancel', authenticate, cancelOrderController);
router.get('/:id/invoice', authenticate, getOrderInvoiceController);

export default router;
