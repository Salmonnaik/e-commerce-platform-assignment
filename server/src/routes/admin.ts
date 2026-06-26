import { Router } from 'express';
import {
  getAdminDashboardController,
  getAllUsersController,
  getAllSellersController,
  getAllOrdersController,
  getAllProductsController,
  getAllPaymentsController,
  getAllShipmentsController,
  getAdminAnalyticsController,
  getRevenueReportController,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require ADMIN role
router.get('/dashboard', authenticate, authorize('ADMIN'), getAdminDashboardController);
router.get('/users', authenticate, authorize('ADMIN'), getAllUsersController);
router.get('/sellers', authenticate, authorize('ADMIN'), getAllSellersController);
router.get('/orders', authenticate, authorize('ADMIN'), getAllOrdersController);
router.get('/products', authenticate, authorize('ADMIN'), getAllProductsController);
router.get('/payments', authenticate, authorize('ADMIN'), getAllPaymentsController);
router.get('/shipments', authenticate, authorize('ADMIN'), getAllShipmentsController);
router.get('/analytics', authenticate, authorize('ADMIN'), getAdminAnalyticsController);
router.get('/revenue-report', authenticate, authorize('ADMIN'), getRevenueReportController);

export default router;
