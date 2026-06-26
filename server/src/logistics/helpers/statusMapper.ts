export const mapCarrierStatusToInternal = (status: string): string => {
  const normalized = status.toUpperCase();

  const map: Record<string, string> = {
    PICKED_UP: 'PICKED_UP',
    PICKUP_DONE: 'PICKED_UP',
    IN_TRANSIT: 'IN_TRANSIT',
    TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    OUTFORDELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    FAILED: 'FAILED',
    DELIVERY_FAILED: 'FAILED',
    RETURNED: 'RETURNED',
    CANCELLED: 'CANCELLED',
    CANCELED: 'CANCELLED',
  };

  return map[normalized] || normalized;
};

export const mapInternalStatusToOrderStatus = (status: string): string | null => {
  const map: Record<string, string> = {
    PICKED_UP: 'SHIPPED',
    IN_TRANSIT: 'SHIPPED',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    FAILED: 'FAILED',
    RETURNED: 'RETURNED',
    CANCELLED: 'CANCELLED',
  };

  return map[status] || null;
};
