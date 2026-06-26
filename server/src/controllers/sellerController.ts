import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const getCurrentSeller = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { userId },
    include: { balance: true },
  });

  if (!seller) {
    throw new Error('Seller not found');
  }

  return seller;
};
import {
  createSeller,
  executePayout,
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  getSellerAnalytics,
} from '../services/sellerService';
import { successResponse, errorResponse } from '../utils/apiResponse';
import prisma from '../config/database';

export const createSellerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await createSeller({
      userId: req.userId!,
      ...req.body,
    });
    res.status(201).json(successResponse(seller, 'Seller account created'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getSellerProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    res.json(successResponse(seller, 'Seller profile retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const updateSellerProfileController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const updatedSeller = await prisma.seller.update({
      where: { id: seller.id },
      data: req.body,
    });

    res.json(successResponse(updatedSeller, 'Seller profile updated'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getSellerBalanceController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const balance = await prisma.sellerBalance.findUnique({
      where: { sellerId: seller.id },
    });

    res.json(successResponse(balance, 'Seller balance retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const getSellerBalanceLedgerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const ledger = await prisma.sellerLedger.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(successResponse(ledger, 'Seller ledger retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const getSellerPayoutsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const payouts = await prisma.payout.findMany({
      where: { sellerId: seller.id },
      include: { logs: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(successResponse(payouts, 'Seller payouts retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const createCurrentSellerPayoutController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const payout = await executePayout(seller.id);
    res.json(successResponse(payout, 'Payout created'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getCurrentSellerProductsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      status: req.query.status as string,
    };

    const result = await getSellerProducts(seller.id, filters);
    res.json(successResponse(result, 'Seller products retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const getCurrentSellerOrdersController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      status: req.query.status as string,
    };

    const result = await getSellerOrders(seller.id, filters);
    res.json(successResponse(result, 'Seller orders retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const getCurrentSellerAnalyticsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await getCurrentSeller(req.userId!);
    const period = (req.query.period as string) || '30d';
    const analytics = await getSellerAnalytics(seller.id, period);
    res.json(successResponse(analytics, 'Seller analytics retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const getSellersController = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellers = await prisma.seller.findMany({
      include: { balance: true, user: true },
    });
    res.json(successResponse(sellers, 'Sellers retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getSellerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id: req.params.id },
      include: { balance: true, ledger: true, payouts: true },
    });

    if (!seller) {
      res.status(404).json(errorResponse('Seller not found'));
      return;
    }

    res.json(successResponse(seller, 'Seller retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getLedgerController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ledger = await prisma.sellerLedger.findMany({
      where: { sellerId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(successResponse(ledger, 'Ledger retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const createPayoutController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payout = await executePayout(req.params.id);
    res.json(successResponse(payout, 'Payout created'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getPayoutsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payouts = await prisma.payout.findMany({
      where: { sellerId: req.params.id },
      include: { logs: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(successResponse(payouts, 'Payouts retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getSellerDashboardController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dashboard = await getSellerDashboard(req.params.id);
    res.json(successResponse(dashboard, 'Seller dashboard retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getSellerProductsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      status: req.query.status as string,
    };

    const result = await getSellerProducts(req.params.id, filters);
    res.json(successResponse(result, 'Seller products retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getSellerOrdersController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      status: req.query.status as string,
    };

    const result = await getSellerOrders(req.params.id, filters);
    res.json(successResponse(result, 'Seller orders retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getSellerAnalyticsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const period = (req.query.period as string) || '30d';
    const analytics = await getSellerAnalytics(req.params.id, period);
    res.json(successResponse(analytics, 'Seller analytics retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};
