       import Stripe from 'stripe';
import { STRIPE } from '../constants';

const stripe = new Stripe(STRIPE.SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (amount: number, currency: string = 'usd', idempotencyKey?: string) => {
  if (!STRIPE.SECRET_KEY) {
    throw new Error('Stripe secret key is not configured. Please set STRIPE_SECRET_KEY in the root .env file.');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100),
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    const message = error?.message || 'Failed to create payment intent';
    console.error('[Stripe] createPaymentIntent error:', message, error);
    throw new Error(`Failed to create payment intent: ${message}`);
  }
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    throw new Error('Failed to retrieve payment intent');
  }
};

export const constructWebhookEvent = (payload: Buffer | string, signature: string) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE.WEBHOOK_SECRET
    );
  } catch (error) {
    throw new Error('Invalid webhook signature');
  }
};

export const refundPayment = async (paymentIntentId: string, amount?: number) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      refundId: refund.id,
      amount: Number(refund.amount) / 100,
      status: refund.status,
    };
  } catch (error) {
    throw new Error('Failed to process refund');
  }
};

export const getPaymentHistory = async (customerId?: string, limit: number = 10) => {
  try {
    const params: any = {
      limit,
    };

    if (customerId) {
      params.customer = customerId;
    }

    const paymentIntents = await stripe.paymentIntents.list(params);

    return paymentIntents.data.map((intent: any) => ({
      id: intent.id,
      amount: Number(intent.amount) / 100,
      currency: intent.currency,
      status: intent.status,
      created: new Date(intent.created * 1000),
      metadata: intent.metadata,
    }));
  } catch (error) {
    throw new Error('Failed to retrieve payment history');
  }
};
