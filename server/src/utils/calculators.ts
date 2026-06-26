export const calculateTax = (subtotal: number, taxPercent: number): number => {
  return (subtotal * taxPercent) / 100;
};

export const calculateCommission = (amount: number, commissionPercent: number): number => {
  return (amount * commissionPercent) / 100;
};

export const calculateGatewayFee = (amount: number, feePercent: number): number => {
  return (amount * feePercent) / 100;
};

export const calculateReturnReserve = (amount: number, reservePercent: number): number => {
  return (amount * reservePercent) / 100;
};

export const calculateSellerEarnings = (
  totalAmount: number,
  platformCommission: number,
  gatewayFee: number,
  logistics: number,
  tax: number,
  returnReserve: number
): number => {
  return totalAmount - platformCommission - gatewayFee - logistics - tax - returnReserve;
};

export const calculatePlatformEarnings = (
  platformCommission: number,
  gatewayFee: number,
  tax: number
): number => {
  return platformCommission + gatewayFee + tax;
};
