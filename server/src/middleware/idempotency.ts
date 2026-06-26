import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

export const idempotencyCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const key = req.headers['idempotency-key'] as string;

  if (!key) {
    next();
    return;
  }

  try {
    const existing = await prisma.idempotencyKey.findUnique({
      where: { key },
    });

    if (existing) {
      if (new Date() > existing.expiresAt) {
        await prisma.idempotencyKey.delete({ where: { key } });
        next();
        return;
      }

      res.json(existing.response as any);
      return;
    }

    next();
  } catch (error) {
    next();
  }
};

export const saveIdempotencyResponse = async (
  key: string,
  response: any,
  expiresAt: Date
): Promise<void> => {
  await prisma.idempotencyKey.create({
    data: { key, response, expiresAt },
  });
};
