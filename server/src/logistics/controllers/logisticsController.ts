import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { getShippingRates, bookShipment, updateTracking, getTrackingDetails, getTrackingHistory, getShipmentByOrderId, getShipmentLabel } from '../services/logisticsService';
import { successResponse, errorResponse } from '../../utils/apiResponse';
import { shippingRateSchema, trackingWebhookSchema } from '../validators/shippingValidator';

export const getShippingRatesController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payload = shippingRateSchema.parse(req.body);
    const rates = await getShippingRates(payload);
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
    const payload = trackingWebhookSchema.parse(req.body);
    const expectedSecret = process.env.SHIPPING_WEBHOOK_SECRET || process.env.SHIPROCKET_WEBHOOK_SECRET;
    const providedSecret = req.headers['x-shipping-webhook-secret'] || req.headers['x-shiprocket-webhook-secret'];

    if (expectedSecret && providedSecret && providedSecret !== expectedSecret) {
      res.status(401).json(errorResponse('Invalid webhook signature'));
      return;
    }

    const trackingNumber = payload.tracking_number || payload.trackingNumber || '';
    await updateTracking(trackingNumber, payload);
    res.json({ received: true });
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getTrackingController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shipment = await getTrackingDetails(req.params.trackingNumber);
    if (!shipment) {
      res.status(404).json(errorResponse('Shipment not found'));
      return;
    }
    res.json(successResponse(shipment, 'Tracking retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getOrderShipmentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shipment = await getShipmentByOrderId(req.params.orderId);
    if (!shipment) {
      res.status(404).json(errorResponse('Shipment not found'));
      return;
    }

    res.json(successResponse(shipment, 'Order shipment retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getShipmentHistoryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = await getTrackingHistory(req.params.trackingNumber);
    res.json(successResponse(history, 'Tracking history retrieved'));
  } catch (error) {
    res.status(404).json(errorResponse((error as Error).message));
  }
};

export const getLabelController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const label = await getShipmentLabel(req.params.shipmentId);
    if (!label) {
      res.status(404).json(errorResponse('Shipping label not found'));
      return;
    }
    res.json(successResponse(label, 'Shipping label retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};
