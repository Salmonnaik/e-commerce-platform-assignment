/**
 * DEMO PAYMENT MODE - PDF Invoice Generator
 * Generates downloadable text invoices (PDF generation requires jsPDF installation)
 */

export interface InvoiceData {
  orderNumber: string;
  invoiceNumber: string;
  paymentId: string;
  trackingId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
}

/**
 * DEMO PAYMENT MODE - Generate text invoice
 * Note: For PDF generation, install jsPDF and uncomment the PDF generation code
 */
export function generateInvoicePDF(data: InvoiceData): void {
  // Generate text-based invoice
  const invoiceContent = `
INVOICE
=====================================

Invoice Number: ${data.invoiceNumber}
Order Number: ${data.orderNumber}
Date: ${new Date(data.createdAt).toLocaleDateString()}

=====================================
FROM:
=====================================
EnterpriseShop
enterprise-ecommerce@demo.com
+1 (555) 123-4567

=====================================
BILL TO:
=====================================
${data.shippingAddress.fullName}
${data.shippingAddress.addressLine1}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}

=====================================
ITEMS:
=====================================
${data.items.map((item) => `${item.name} x${item.quantity} @ $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`).join('\n')}

=====================================
TOTALS:
=====================================
Subtotal: $${data.subtotal.toFixed(2)}
Tax: $${data.tax.toFixed(2)}
Shipping: $${data.shipping.toFixed(2)}
-------------------------------------
TOTAL: $${data.total.toFixed(2)}

Payment ID: ${data.paymentId}
Tracking ID: ${data.trackingId}
Estimated Delivery: ${data.estimatedDelivery}

Thank you for your purchase!
  `.trim();

  const blob = new Blob([invoiceContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${data.orderNumber}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download invoice for an order
 */
export function downloadOrderInvoice(orderData: any, demoData?: any): void {
  const invoiceData: InvoiceData = {
    orderNumber: orderData.orderNumber,
    invoiceNumber: demoData?.invoiceNumber || `INV-${Date.now()}`,
    paymentId: demoData?.paymentId || orderData.payment?.[0]?.paymentIntentId || 'N/A',
    trackingId: demoData?.trackingId || 'N/A',
    customerName: orderData.user?.name || 'Customer',
    customerEmail: orderData.user?.email || 'customer@email.com',
    shippingAddress: orderData.shippingAddress || {
      fullName: 'Shipping Address',
      addressLine1: 'Not Available',
      city: '',
      state: '',
      postalCode: '',
    },
    items: orderData.items?.map((item: any) => ({
      name: item.product?.name || 'Product',
      quantity: item.quantity,
      price: item.price,
    })) || [],
    subtotal: orderData.subtotal || 0,
    tax: orderData.tax || 0,
    shipping: orderData.shipping || 5,
    total: orderData.total || 0,
    createdAt: orderData.createdAt || new Date().toISOString(),
    estimatedDelivery: demoData?.estimatedDelivery || 'TBD',
  };

  generateInvoicePDF(invoiceData);
}
