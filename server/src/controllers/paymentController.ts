import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createCheckout, handlePaymentSuccess, handlePaymentFailure, refundPayment } from '../services/paymentService';
// DEMO PAYMENT MODE - Import demo checkout service
import { createDemoCheckout } from '../services/demoCheckoutService';
import { constructWebhookEvent } from '../services/stripeService';
import { saveIdempotencyResponse } from '../middleware/idempotency';
import { addMinutes } from '../utils/date';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { SERVER } from '../constants';
import prisma from '../config/database';

export const createCheckoutController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const idempotencyKey = req.headers['idempotency-key'] as string;

    // DEMO PAYMENT MODE - Use demo checkout if enabled
    const result = SERVER.DEMO_PAYMENT
      ? await createDemoCheckout({
          userId: req.userId!,
          items: req.body.items,
          shippingAddress: req.body.shippingAddress,
          idempotencyKey,
        })
      : await createCheckout({
          userId: req.userId!,
          items: req.body.items,
          shippingAddress: req.body.shippingAddress,
          idempotencyKey,
        });

    if (idempotencyKey) {
      await saveIdempotencyResponse(
        idempotencyKey,
        successResponse(result, 'Checkout created'),
        addMinutes(new Date(), 10)
      );
    }

    res.json(successResponse(result, 'Checkout created'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const webhookController = async (req: AuthRequest, res: Response): Promise<void> => {
  const signature = req.headers['stripe-signature'] as string;
  const payload = req.body as Buffer;

  try {
    const event = constructWebhookEvent(payload, signature);

    await prisma.webhookLog.create({
      data: {
        source: 'stripe',
        eventId: event.id,
        eventType: event.type,
        payload: JSON.stringify(event.data),
      },
    });

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        await handlePaymentSuccess(paymentIntent.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        await handlePaymentFailure(paymentIntent.id, paymentIntent.last_payment_error?.message || 'Payment failed');
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    await prisma.webhookLog.updateMany({
      where: { eventId: event.id },
      data: { processed: true },
    });

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getPaymentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: { order: true },
    });

    if (!payment) {
      res.status(404).json(errorResponse('Payment not found'));
      return;
    }

    res.json(successResponse(payment, 'Payment retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const refundPaymentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    const refund = await refundPayment(req.params.id, amount);
    res.json(successResponse(refund, 'Refund processed successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};
