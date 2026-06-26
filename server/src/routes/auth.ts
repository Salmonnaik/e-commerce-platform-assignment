import { Router } from 'express';
import { registerController, loginController, getProfileController, googleAuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/google', googleAuthController);
router.get('/profile', authenticate, getProfileController);

export default router;
