import { Router } from 'express';
import { registerController, loginController, getProfileController, googleAuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/authValidator';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/google', validate(googleAuthSchema), googleAuthController);
router.get('/profile', authenticate, getProfileController);

export default router;
