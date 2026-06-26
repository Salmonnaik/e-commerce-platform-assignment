import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getAdminDashboard,
  getAllUsers,
  getAllSellers,
  getAllOrders,
  getAllProducts,
  getAllPayments,
  getAllShipments,
  getAdminAnalytics,
  getRevenueReport,
} from '../services/adminService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const getAdminDashboardController = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dashboard = await getAdminDashboard();
    res.json(successResponse(dashboard, 'Admin dashboard retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getAllUsersController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      role: req.query.role as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getAllUsers(filters);
    res.json(successResponse(result, 'Users retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getAllSellersController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getAllSellers(filters);
    res.json(successResponse(result, 'Sellers retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getAllOrdersController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getAllOrders(filters);
    res.json(successResponse(result, 'Orders retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getAllProductsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string,
      categoryId: req.query.categoryId as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getAllProducts(filters);
    res.json(successResponse(result, 'Products retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getAllPaymentsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getAllPayments(filters);
    res.json(successResponse(result, 'Payments retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getAllShipmentsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getAllShipments(filters);
    res.json(successResponse(result, 'Shipments retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getAdminAnalyticsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const period = (req.query.period as string) || '30d';
    const analytics = await getAdminAnalytics(period);
    res.json(successResponse(analytics, 'Admin analytics retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getRevenueReportController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const report = await getRevenueReport(startDate, endDate);
    res.json(successResponse(report, 'Revenue report retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};
