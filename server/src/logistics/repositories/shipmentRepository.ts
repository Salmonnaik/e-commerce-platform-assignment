import prisma from '../../config/database';

export const shipmentRepository = {
  async findByOrderId(orderId: string) {
    return prisma.shipment.findUnique({ where: { orderId } });
  },

  async findByTrackingNumber(trackingNumber: string) {
    return prisma.shipment.findUnique({ where: { trackingNumber }, include: { trackingHistory: true, order: true } });
  },

  async create(data: any) {
    return prisma.shipment.create({ data });
  },

  async update(id: string, data: any) {
    return prisma.shipment.update({ where: { id }, data });
  },

  async createHistory(data: any) {
    return prisma.trackingHistory.create({ data });
  },

  async createLog(data: any) {
    return prisma.shipmentLog.create({ data });
  },

  async listPending() {
    return prisma.shipment.findMany({
      where: { status: { in: ['PENDING', 'PICKED_UP', 'IN_TRANSIT'] } },
      include: { order: true },
    });
  },
};
