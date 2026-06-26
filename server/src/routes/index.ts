import { Router } from 'express';
import authRoutes from './auth';
import paymentRoutes from './payments';
import sellerRoutes from './sellers';
import logisticsRoutes from './logistics';
import productRoutes from './products';
import categoryRoutes from './categories';
import orderRoutes from './orders';
import adminRoutes from './admin';

const router = Router();

router.use('/auth', authRoutes);
router.use('/v1/payments', paymentRoutes);
router.use('/v1/sellers', sellerRoutes);
router.use('/v1/logistics', logisticsRoutes);
router.use('/v1/products', productRoutes);
router.use('/v1/categories', categoryRoutes);
router.use('/v1/orders', orderRoutes);
router.use('/admin', adminRoutes);

export default router;
