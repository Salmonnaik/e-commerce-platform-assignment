import { Router } from 'express';
import {
  createSellerController,
  getSellerProfileController,
  updateSellerProfileController,
  getSellerBalanceController,
  getSellerBalanceLedgerController,
  getSellerPayoutsController as getAuthenticatedSellerPayoutsController,
  createCurrentSellerPayoutController,
  getCurrentSellerProductsController,
  getCurrentSellerOrdersController,
  getCurrentSellerAnalyticsController,
  getSellersController,
  getSellerController,
  getLedgerController,
  createPayoutController,
  getPayoutsController,
  getSellerDashboardController,
  getSellerProductsController,
  getSellerOrdersController,
  getSellerAnalyticsController,
} from '../controllers/sellerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'SELLER'), createSellerController);
router.get('/profile', authenticate, authorize('ADMIN', 'SELLER'), getSellerProfileController);
router.put('/profile', authenticate, authorize('ADMIN', 'SELLER'), updateSellerProfileController);
router.get('/balance', authenticate, authorize('ADMIN', 'SELLER'), getSellerBalanceController);
router.get('/ledger', authenticate, authorize('ADMIN', 'SELLER'), getSellerBalanceLedgerController);
router.get('/products', authenticate, authorize('ADMIN', 'SELLER'), getCurrentSellerProductsController);
router.get('/orders', authenticate, authorize('ADMIN', 'SELLER'), getCurrentSellerOrdersController);
router.get('/analytics', authenticate, authorize('ADMIN', 'SELLER'), getCurrentSellerAnalyticsController);
router.post('/payouts', authenticate, authorize('ADMIN', 'SELLER'), createCurrentSellerPayoutController);
router.get('/payouts', authenticate, authorize('ADMIN', 'SELLER'), getAuthenticatedSellerPayoutsController);
router.get('/', authenticate, authorize('ADMIN'), getSellersController);
router.get('/:id', authenticate, authorize('ADMIN', 'SELLER'), getSellerController);
router.get('/:id/ledger', authenticate, authorize('ADMIN', 'SELLER'), getLedgerController);
router.get('/:id/dashboard', authenticate, authorize('ADMIN', 'SELLER'), getSellerDashboardController);
router.get('/:id/products', authenticate, authorize('ADMIN', 'SELLER'), getSellerProductsController);
router.get('/:id/orders', authenticate, authorize('ADMIN', 'SELLER'), getSellerOrdersController);
router.get('/:id/analytics', authenticate, authorize('ADMIN', 'SELLER'), getSellerAnalyticsController);
router.post('/:id/payouts', authenticate, authorize('ADMIN', 'SELLER'), createPayoutController);
router.get('/:id/payouts', authenticate, authorize('ADMIN', 'SELLER'), getPayoutsController);

export default router;
