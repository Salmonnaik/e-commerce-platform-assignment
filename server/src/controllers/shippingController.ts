import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getShippingRates, bookShipment, updateTracking } from '../services/shippingService';
import { successResponse, errorResponse } from '../utils/apiResponse';
import prisma from '../config/database';

export const getShippingRatesController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rates = await getShippingRates(req.body);
    res.json(successResponse(rates, 'Shipping rates retrieved'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const bookShipmentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shipment = await bookShipment(req.params.orderId);
    res.json(successResponse(shipment, 'Shipment booked'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const trackingWebhookController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tracking_number, status } = req.body;
    await updateTracking(tracking_number, status);
    res.json({ received: true });
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getTrackingController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: req.params.trackingNumber },
      include: { trackingHistory: true, order: true },
    });

    if (!shipment) {
      res.status(404).json(errorResponse('Shipment not found'));
      return;
    }

    res.json(successResponse(shipment, 'Tracking retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};
