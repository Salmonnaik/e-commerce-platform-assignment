import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import logger from '../../config/logger';
import { shipmentRepository } from '../repositories/shipmentRepository';
import { getShippingRatesFromProvider, bookShipmentWithProvider, trackShipmentWithProvider } from './shippingProvider';
import { mapCarrierStatusToInternal, mapInternalStatusToOrderStatus } from '../helpers/statusMapper';
import { ShippingRateRequest, ShippingRateOption, ShipmentBookingResult, TrackingWebhookPayload } from '../types';

export const getShippingRates = async (payload: ShippingRateRequest): Promise<ShippingRateOption[]> => {
  const providerRates = await getShippingRatesFromProvider(payload);

  const rates: ShippingRateOption[] = providerRates
    .map((rate: ShippingRateOption) => ({
      courier: rate.courier,
      estimatedDays: rate.estimatedDays,
      shippingCost: Number(rate.shippingCost),
      service: rate.service || 'Express',
    }))
    .sort((a: ShippingRateOption, b: ShippingRateOption) => a.shippingCost - b.shippingCost);

  await prisma.shippingRate.create({
    data: {
      courierName: rates[0]?.courier || 'Unknown',
      service: rates[0]?.service || 'Express',
      originPincode: payload.originPincode,
      destinationPincode: payload.destinationPincode,
      weight: payload.weight,
      estimatedDays: rates[0]?.estimatedDays || 0,
      shippingCost: rates[0]?.shippingCost || 0,
    },
  });

  return rates;
};

export const bookShipment = async (orderId: string): Promise<ShipmentBookingResult> => {
  const existing = await shipmentRepository.findByOrderId(orderId);
  if (existing) {
    return {
      id: existing.id,
      trackingNumber: existing.trackingNumber,
      awb: existing.awb,
      shipmentId: existing.shipmentId,
      pickupId: existing.pickupId,
      courierName: existing.courierName,
      shippingLabelUrl: existing.shippingLabelUrl,
      labelPdfUrl: existing.labelPdfUrl,
      estimatedDelivery: existing.estimatedDelivery,
      status: existing.status,
    };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      shippingAddress: true,
      items: { include: { product: true } },
    },
  });

  if (!order || !order.shippingAddress) {
    throw new Error('Order or shipping address not found');
  }

  const destinationPincode = order.shippingAddress?.postalCode || '000000';

  const payload = {
    order_id: order.orderNumber,
    order_date: new Date().toISOString(),
    pickup_location: 'primary',
    channel_id: '',
    comment: '',
    reseller_name: 'Enterprise E-Commerce',
    company_name: 'Enterprise E-Commerce',
    billing_customer_name: order.shippingAddress.fullName,
    billing_last_name: '',
    billing_address: order.shippingAddress.addressLine1,
    billing_address_2: order.shippingAddress.addressLine2 || '',
    billing_city: order.shippingAddress.city,
    billing_state: order.shippingAddress.state,
    billing_pincode: order.shippingAddress.postalCode,
    billing_country: order.shippingAddress.country,
    billing_email: '',
    billing_phone: order.shippingAddress.phone,
    shipping_is_billing: true,
    shipping_customer_name: order.shippingAddress.fullName,
    shipping_last_name: '',
    shipping_address: order.shippingAddress.addressLine1,
    shipping_address_2: order.shippingAddress.addressLine2 || '',
    shipping_city: order.shippingAddress.city,
    shipping_state: order.shippingAddress.state,
    shipping_pincode: order.shippingAddress.postalCode,
    shipping_country: order.shippingAddress.country,
    shipping_email: '',
    shipping_phone: order.shippingAddress.phone,
    order_items: order.items.map((item: any) => ({
      name: item.product.name,
      sku: item.product.id,
      units: item.quantity,
      selling_price: Number(item.price),
    })),
    payment_method: 'Prepaid',
    sub_total: Number(order.subtotal),
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  const providerShipment = await bookShipmentWithProvider(payload);

  const shipment = await prisma.$transaction(async (tx) => {
    const createdShipment = await tx.shipment.create({
      data: {
        orderId,
        trackingNumber: providerShipment.tracking_id || `TRK-${Date.now()}`,
        awb: providerShipment.awb_code,
        shipmentId: providerShipment.shipment_id,
        pickupId: providerShipment.pickup_id,
        courierName: providerShipment.courier_company,
        shippingLabelUrl: providerShipment.label_url,
        labelPdfUrl: providerShipment.label_pdf_url,
        estimatedDelivery: providerShipment.estimated_delivery_date ? new Date(providerShipment.estimated_delivery_date) : null,
        status: 'PENDING',
        weight: 0.5,
        length: 10,
        width: 10,
        height: 10,
        shippingCost: Number(order.shipping),
        warehousePincode: '500001',
        destinationPincode,
      },
    });

    await tx.trackingHistory.create({
      data: {
        shipmentId: createdShipment.id,
        trackingNumber: createdShipment.trackingNumber,
        status: 'PENDING',
        description: 'Shipment created',
      },
    });

    await tx.shippingLabel.create({
      data: {
        shipmentId: createdShipment.id,
        labelUrl: createdShipment.shippingLabelUrl,
        pdfUrl: createdShipment.labelPdfUrl,
        awb: createdShipment.awb,
        courierName: createdShipment.courierName,
      },
    });

    await tx.shipmentLog.create({
      data: {
        shipmentId: createdShipment.id,
        event: 'SHIPMENT_CREATED',
        message: 'Shipment created successfully',
      },
    });

    await tx.order.update({ where: { id: orderId }, data: { status: 'PROCESSING' } });

    return createdShipment;
  });

  logger.info(`Shipment booked: ${shipment.id}`);

  return {
    id: shipment.id,
    trackingNumber: shipment.trackingNumber,
    awb: shipment.awb,
    shipmentId: shipment.shipmentId,
    pickupId: shipment.pickupId,
    courierName: shipment.courierName,
    shippingLabelUrl: shipment.shippingLabelUrl,
    labelPdfUrl: shipment.labelPdfUrl,
    estimatedDelivery: shipment.estimatedDelivery,
    status: shipment.status,
  };
};

export const updateTracking = async (trackingNumber: string, payload: TrackingWebhookPayload) => {
  const shipment = await prisma.shipment.findFirst({
    where: { trackingNumber: payload.tracking_number || payload.trackingNumber || trackingNumber },
    include: { order: true },
  });

  if (!shipment) {
    throw new Error('Shipment not found');
  }

  const mappedStatus = mapCarrierStatusToInternal(payload.status || '');
  const orderStatus = mapInternalStatusToOrderStatus(mappedStatus);

  const updatedShipment = await prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipment.id },
      data: { status: mappedStatus as any },
    });

    await tx.trackingHistory.create({
      data: {
        shipmentId: shipment.id,
        trackingNumber: shipment.trackingNumber,
        status: mappedStatus,
        location: payload.location,
        description: payload.description || `Status updated to ${mappedStatus}`,
        timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
      },
    });

    await tx.shipmentLog.create({
      data: {
        shipmentId: shipment.id,
        event: 'TRACKING_UPDATE',
        message: `Tracking updated to ${mappedStatus}`,
        metadata: payload as unknown as Prisma.JsonObject,
      },
    });

    if (orderStatus) {
      await tx.order.update({ where: { id: shipment.orderId }, data: { status: orderStatus as any } });
    }

    return updated;
  });

  logger.info(`Tracking updated: ${shipment.trackingNumber} - ${mappedStatus}`);
  return updatedShipment;
};

export const getTrackingDetails = async (trackingNumber: string) => {
  return shipmentRepository.findByTrackingNumber(trackingNumber);
};

export const getTrackingHistory = async (trackingNumber: string) => {
  const shipment = await shipmentRepository.findByTrackingNumber(trackingNumber);
  if (!shipment) {
    throw new Error('Shipment not found');
  }

  return {
    trackingNumber,
    shipmentId: shipment.id,
    history: shipment.trackingHistory.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  };
};

export const getShipmentByOrderId = async (orderId: string) => {
  return shipmentRepository.findByOrderId(orderId);
};

export const getShipmentLabel = async (shipmentId: string) => {
  return prisma.shippingLabel.findUnique({ where: { shipmentId } });
};

export const syncShipments = async () => {
  const shipments = await shipmentRepository.listPending();

  for (const shipment of shipments) {
    try {
      const trackingData = await trackShipmentWithProvider(shipment.shipmentId);
      if (trackingData?.tracking_status) {
        await updateTracking(shipment.trackingNumber, {
          tracking_number: shipment.trackingNumber,
          status: trackingData.tracking_status,
          description: trackingData.current_status,
          location: trackingData.current_city || trackingData.city,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error(`Failed to sync shipment: ${shipment.id}`);
    }
  }

  return { synced: shipments.length };
};
