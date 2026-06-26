import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  cancelOrder,
  getOrderInvoice,
} from '../services/orderService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createOrderController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await createOrder(req.userId!, req.body);
    res.status(201).json(successResponse(order, 'Order created successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getCustomerOrdersController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getCustomerOrders(req.userId!, filters);
    res.json(successResponse(result, 'Orders retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getOrderController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await getOrderById(req.params.id, req.userId!, req.userRole!);
    if (!order) {
      res.status(404).json(errorResponse('Order not found'));
      return;
    }
    res.json(successResponse(order, 'Order retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const cancelOrderController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await cancelOrder(req.params.id, req.userId!, req.userRole!);
    res.json(successResponse(order, 'Order cancelled successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getOrderInvoiceController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await getOrderInvoice(req.params.id, req.userId!, req.userRole!);
    res.json(successResponse(invoice, 'Invoice retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};
