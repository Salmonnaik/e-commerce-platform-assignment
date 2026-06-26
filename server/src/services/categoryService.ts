import prisma from '../config/database';
import { generateSlug } from '../utils/uuid';
import logger from '../config/logger';

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  const slug = generateSlug(data.name);

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
  });

  logger.info(`Category created: ${category.id}`);
  return category;
};

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return categories.map((category: any) => ({
    ...category,
    productCount: category._count.products,
  }));
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
      products: {
        where: { isActive: true },
        take: 10,
        include: {
          seller: true,
          inventory: true,
        },
      },
    },
  });

  if (!category) return null;

  return {
    ...category,
    productCount: category._count.products,
  };
};

export const updateCategory = async (id: string, data: {
  name?: string;
  description?: string;
}) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const updateData: any = { ...data };

  if (data.name) {
    updateData.slug = generateSlug(data.name);
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: updateData,
  });

  logger.info(`Category updated: ${id}`);
  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  if (category._count.products > 0) {
    throw new Error('Cannot delete category with existing products');
  }

  await prisma.category.delete({
    where: { id },
  });

  logger.info(`Category deleted: ${id}`);
};
