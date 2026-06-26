import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { JWT } from '../constants';
export { googleAuth } from './googleAuthService';

export const register = async (data: {
  email: string;
  password: string;
  name: string;
  role?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: (data.role as 'CUSTOMER' | 'SELLER' | 'ADMIN') || 'CUSTOMER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT.SECRET,
    { expiresIn: JWT.EXPIRES_IN as any }
  );

  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT.SECRET,
    { expiresIn: JWT.EXPIRES_IN as any }
  );

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
