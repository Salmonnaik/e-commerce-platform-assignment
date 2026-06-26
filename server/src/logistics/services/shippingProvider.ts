import axios from 'axios';
import { SHIPROCKET } from '../../constants';

const shiprocketApi = axios.create({ baseURL: SHIPROCKET.API_URL });

let authToken: string | null = null;

const getAuthToken = async (): Promise<string> => {
  if (authToken) return authToken;

  try {
    const response = await shiprocketApi.post('/auth/login', {
      email: SHIPROCKET.EMAIL,
      password: SHIPROCKET.PASSWORD,
    });

    authToken = response.data.token as string;
    return authToken;
  } catch (error) {
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

export const getShippingRatesFromProvider = async (payload: {
  originPincode: string;
  destinationPincode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}) => {
  const token = await getAuthToken();

  const response = await shiprocketApi.post(
    '/courier/serviceability/',
    {
      pickup_postcode: payload.originPincode,
      delivery_postcode: payload.destinationPincode,
      weight: payload.weight,
      length: payload.length,
      breadth: payload.width,
      height: payload.height,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const rates = response.data.data?.recommended_courier_companies || [];

  return rates.map((rate: any) => ({
    courier: rate.courier_name,
    shippingCost: Number(rate.rate || 0),
    estimatedDays: Number(rate.estimated_delivery_days || 0),
    service: rate.courier_name,
  }));
};

export const bookShipmentWithProvider = async (payload: any) => {
  const token = await getAuthToken();

  const response = await shiprocketApi.post('/orders/create/adhoc', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};

export const trackShipmentWithProvider = async (shipmentId: string | null | undefined) => {
  if (!shipmentId) {
    throw new Error('Shipment ID not available');
  }

  const token = await getAuthToken();
  const response = await shiprocketApi.get(`/courier/track/shipment/${shipmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data?.tracking_data;
};
