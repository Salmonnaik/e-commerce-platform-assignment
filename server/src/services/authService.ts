import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT } from '../constants';
import User, { type IUser, type UserRole } from '../models/User';
export { googleAuth } from './googleAuthService';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

const sanitizeUser = (user: IUser) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const signToken = (user: IUser) =>
  (jwt.sign as any)({ userId: user._id.toString(), role: user.role }, JWT.SECRET, {
    expiresIn: String(JWT.EXPIRES_IN),
  });

export const register = async (data: RegisterInput) => {
  const existingUser = await User.findOne({ email: data.email.toLowerCase() }).lean();
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    email: data.email.toLowerCase(),
    password: hashedPassword,
    name: data.name,
    role: data.role || 'CUSTOMER',
    status: 'ACTIVE',
  });

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUser(user);
};
