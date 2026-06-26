import prisma from '../config/database';
import { generateSlug } from '../utils/uuid';
import logger from '../config/logger';

export const createProduct = async (data: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  stock?: number;
  images?: string[];
  isActive?: boolean;
}) => {
  const slug = generateSlug(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      sellerId: data.sellerId,
      stock: data.stock || 0,
      images: data.images || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      inventory: {
        create: {
          quantity: data.stock || 0,
          available: data.stock || 0,
          reserved: 0,
          lowStockThreshold: 10,
        },
      },
    },
    include: {
      category: true,
      seller: true,
      inventory: true,
    },
  });

  logger.info(`Product created: ${product.id}`);
  return product;
};

export const getProducts = async (filters: {
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}) => {
  const {
    categoryId,
    sellerId,
    minPrice,
    maxPrice,
    inStock,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = filters;

  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (sellerId) {
    where.sellerId = sellerId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStock) {
    where.stock = { gt: 0 };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: true,
        inventory: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        include: {
          balance: true,
        },
      },
      inventory: true,
    },
  });

  return product;
};

export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    stock?: number;
    images?: string[];
    isActive?: boolean;
  },
  userId: string,
  userRole: string
) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { seller: true },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (userRole !== 'ADMIN' && product.sellerId !== userId) {
    throw new Error('Unauthorized to update this product');
  }

  const updateData: any = { ...data };

  if (data.name) {
    updateData.slug = generateSlug(data.name);
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      seller: true,
      inventory: true,
    },
  });

  if (data.stock !== undefined) {
    await prisma.inventory.update({
      where: { productId: id },
      data: {
        quantity: data.stock,
        available: data.stock - ((product as any).inventory?.reserved || 0),
      },
    });
  }

  logger.info(`Product updated: ${id}`);
  return updatedProduct;
};

export const deleteProduct = async (id: string, userId: string, userRole: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (userRole !== 'ADMIN' && product.sellerId !== userId) {
    throw new Error('Unauthorized to delete this product');
  }

  await prisma.product.delete({
    where: { id },
  });

  logger.info(`Product deleted: ${id}`);
};

export const searchProducts = async (params: {
  query: string;
  categoryId?: string;
  page: number;
  limit: number;
}) => {
  const { query, categoryId, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: true,
        inventory: true,
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateInventory = async (
  productId: string,
  data: { quantity: number; lowStockThreshold?: number },
  userId: string,
  userRole: string
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true, inventory: true },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (userRole !== 'ADMIN' && product.sellerId !== userId) {
    throw new Error('Unauthorized to update inventory');
  }

  const inventory = await prisma.inventory.upsert({
    where: { productId },
    create: {
      productId,
      quantity: data.quantity,
      available: data.quantity,
      reserved: 0,
      lowStockThreshold: data.lowStockThreshold || 10,
    },
    update: {
      quantity: data.quantity,
      available: data.quantity - (product.inventory?.reserved || 0),
      ...(data.lowStockThreshold && { lowStockThreshold: data.lowStockThreshold }),
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { stock: data.quantity },
  });

  logger.info(`Inventory updated: ${productId}`);
  return inventory;
};
