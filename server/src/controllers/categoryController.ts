import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createCategoryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(successResponse(category, 'Category created successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const getCategoriesController = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await getCategories();
    res.json(successResponse(categories, 'Categories retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const getCategoryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      res.status(404).json(errorResponse('Category not found'));
      return;
    }
    res.json(successResponse(category, 'Category retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse((error as Error).message));
  }
};

export const updateCategoryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.json(successResponse(category, 'Category updated successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};

export const deleteCategoryController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await deleteCategory(req.params.id);
    res.json(successResponse(null, 'Category deleted successfully'));
  } catch (error) {
    res.status(400).json(errorResponse((error as Error).message));
  }
};
