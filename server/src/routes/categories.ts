import { Router } from 'express';
import {
  createCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getCategoriesController);
router.get('/:id', getCategoryController);

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), createCategoryController);
router.put('/:id', authenticate, authorize('ADMIN'), updateCategoryController);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategoryController);

export default router;
