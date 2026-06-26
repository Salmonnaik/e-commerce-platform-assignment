import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  updateInventory,
} from '../services/productService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createProductController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await createProduct({
      ...req.body,
      sellerId: req.userId!,
    });
    res.status(201).json(successResponse(product, 'Product created successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getProductsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filters = {
      categoryId: req.query.categoryId as string,
      sellerId: req.query.sellerId as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      inStock: req.query.inStock === 'true',
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await getProducts(filters);
    res.json(successResponse(result, 'Products retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getProductController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      res.status(404).json(errorResponse('Product not found'));
      return;
    }
    res.json(successResponse(product, 'Product retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const updateProductController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await updateProduct(req.params.id, req.body, req.userId!, req.userRole!);
    res.json(successResponse(product, 'Product updated successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const deleteProductController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await deleteProduct(req.params.id, req.userId!, req.userRole!);
    res.json(successResponse(null, 'Product deleted successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const searchProductsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const results = await searchProducts({
      query: req.query.q as string,
      categoryId: req.query.categoryId as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    });
    res.json(successResponse(results, 'Search results retrieved'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const updateInventoryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const inventory = await updateInventory(req.params.id, req.body, req.userId!, req.userRole!);
    res.json(successResponse(inventory, 'Inventory updated successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};
