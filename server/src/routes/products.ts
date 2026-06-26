import { Router } from 'express';
import {
  createProductController,
  getProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
  searchProductsController,
  updateInventoryController,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProductsController);
router.get('/search', searchProductsController);
router.get('/:id', getProductController);

// Protected routes - Seller only
router.post('/', authenticate, authorize('SELLER', 'ADMIN'), createProductController);
router.put('/:id', authenticate, authorize('SELLER', 'ADMIN'), updateProductController);
router.delete('/:id', authenticate, authorize('SELLER', 'ADMIN'), deleteProductController);
router.patch('/:id/inventory', authenticate, authorize('SELLER', 'ADMIN'), updateInventoryController);

export default router;
