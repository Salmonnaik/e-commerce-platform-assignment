import nodemailer from 'nodemailer';
import prisma from '../config/database';
import logger from '../config/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@enterprise-ecommerce.com',
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, error);
    throw error;
  }
};

export const queueEmail = async (to: string, subject: string, template: string, data: any) => {
  try {
    await prisma.emailQueue.create({
      data: {
        to,
        subject,
        template,
        data,
        status: 'pending',
      },
    });
    logger.info(`Email queued for ${to}`);
  } catch (error) {
    logger.error(`Failed to queue email for ${to}`, error);
    throw error;
  }
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to EnterpriseShop!</h2>
      <p>Hi ${name},</p>
      <p>Welcome to EnterpriseShop! We're excited to have you on board.</p>
      <p>Start shopping now and discover amazing products from our verified sellers.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, 'Welcome to EnterpriseShop!', html);
};

export const sendOrderConfirmationEmail = async (to: string, orderNumber: string, total: number) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Hi,</p>
      <p>Your order <strong>${orderNumber}</strong> has been confirmed successfully.</p>
      <p>Total Amount: <strong>$${total.toFixed(2)}</strong></p>
      <p>You will receive another email when your order is shipped.</p>
      <p>Thank you for shopping with us!</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, `Order Confirmation - ${orderNumber}`, html);
};

export const sendPaymentSuccessEmail = async (to: string, orderNumber: string, amount: number) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Payment Successful</h2>
      <p>Hi,</p>
      <p>Your payment of <strong>$${amount.toFixed(2)}</strong> for order <strong>${orderNumber}</strong> was successful.</p>
      <p>Your order is now being processed and will be shipped soon.</p>
      <p>Thank you for your purchase!</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, `Payment Successful - ${orderNumber}`, html);
};

export const sendPaymentFailedEmail = async (to: string, orderNumber: string, reason: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc3545;">Payment Failed</h2>
      <p>Hi,</p>
      <p>Your payment for order <strong>${orderNumber}</strong> has failed.</p>
      <p>Reason: ${reason}</p>
      <p>Please try again or contact our support team if you continue to face issues.</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, `Payment Failed - ${orderNumber}`, html);
};

export const sendShipmentCreatedEmail = async (to: string, orderNumber: string, trackingNumber: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Shipped</h2>
      <p>Hi,</p>
      <p>Your order <strong>${orderNumber}</strong> has been shipped!</p>
      <p>Tracking Number: <strong>${trackingNumber}</strong></p>
      <p>You can track your shipment using the tracking number provided.</p>
      <p>Thank you for shopping with us!</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, `Order Shipped - ${orderNumber}`, html);
};

export const sendOutOfDeliveryEmail = async (to: string, orderNumber: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">Out for Delivery</h2>
      <p>Hi,</p>
      <p>Your order <strong>${orderNumber}</strong> is out for delivery!</p>
      <p>It will be delivered to your address soon. Please ensure someone is available to receive the package.</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, `Out for Delivery - ${orderNumber}`, html);
};

export const sendDeliveredEmail = async (to: string, orderNumber: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Order Delivered</h2>
      <p>Hi,</p>
      <p>Your order <strong>${orderNumber}</strong> has been delivered successfully!</p>
      <p>We hope you enjoy your purchase. Please leave a review on our website.</p>
      <p>Thank you for shopping with EnterpriseShop!</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, `Order Delivered - ${orderNumber}`, html);
};

export const sendSellerPayoutSuccessEmail = async (to: string, amount: number, referenceId: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Payout Successful</h2>
      <p>Hi,</p>
      <p>Your payout of <strong>$${amount.toFixed(2)}</strong> has been processed successfully.</p>
      <p>Reference ID: <strong>${referenceId}</strong></p>
      <p>The amount has been credited to your bank account.</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, `Payout Successful - ${referenceId}`, html);
};

export const sendSellerPayoutFailedEmail = async (to: string, amount: number, reason: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc3545;">Payout Failed</h2>
      <p>Hi,</p>
      <p>Your payout of <strong>$${amount.toFixed(2)}</strong> has failed.</p>
      <p>Reason: ${reason}</p>
      <p>We will retry the payout automatically. Please ensure your bank details are correct.</p>
      <p>Best regards,<br>The EnterpriseShop Team</p>
    </div>
  `;
  await sendEmail(to, 'Payout Failed', html);
};

export const processEmailQueue = async () => {
  const pendingEmails = await prisma.emailQueue.findMany({
    where: {
      status: 'pending',
      attempts: {
        lt: 3,
      },
    },
    take: 50,
  });

  let processed = 0;

  for (const email of pendingEmails) {
    try {
      await sendEmail(email.to, email.subject, email.template);

      await prisma.emailQueue.update({
        where: { id: email.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });

      processed++;
    } catch (error) {
      await prisma.emailQueue.update({
        where: { id: email.id },
        data: {
          attempts: { increment: 1 },
          error: (error as Error).message,
        },
      });
    }
  }

  return { processed };
};
