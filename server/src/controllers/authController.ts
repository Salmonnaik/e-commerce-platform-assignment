import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { register, login, getProfile, googleAuth } from '../services/authService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const registerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    const result = await register({ email, password, name, role });
    res.status(201).json(successResponse(result, 'User registered successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const loginController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(successResponse(result, 'Login successful'));
  } catch (error) {
    res.status(401).json(errorResponse((error as Error).message));
  }
};

export const googleAuthController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;
    const result = await googleAuth(idToken);
    res.json(successResponse(result, 'Google login successful'));
  } catch (error) {
    res.status(401).json(errorResponse((error as Error).message));
  }
};

export const getProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getProfile(req.userId!);
    res.json(successResponse(user, 'Profile retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};
