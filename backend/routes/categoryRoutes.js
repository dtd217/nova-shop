import express from "express";
import {
   categoryControlller,
   createCategoryController,
   deleteCategoryController,
   singleCategoryControlller,
   updateCategoryController
} from "../controllers/categoryController.js";
import { adminOnly, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create category
router.post('/create-category', requireSignIn, adminOnly, createCategoryController)

// Update category
router.put('/update-category/:id', requireSignIn, adminOnly, updateCategoryController)

// Get all categories
router.get('/get-categories', categoryControlller)

// Get single category
router.get('/single-category/:slug', singleCategoryControlller)

// Delete category
router.delete('/delete-category/:id', requireSignIn, adminOnly, deleteCategoryController)

export default router;