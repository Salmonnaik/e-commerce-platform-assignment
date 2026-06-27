import jwt from 'jsonwebtoken';
import { JWT } from '../constants';

export const generateToken = (payload: { userId: string; role: string }) =>
  (jwt.sign as any)(payload, JWT.SECRET, { expiresIn: String(JWT.EXPIRES_IN) });

export const verifyToken = (token: string) => (jwt.verify as any)(token, JWT.SECRET) as { userId: string; role: string };
