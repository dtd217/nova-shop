import express from "express";
import formidable from "express-formidable";
import { adminOnly, requireSignIn } from "../middleware/authMiddleware.js";
import {
   createProductController,
   deleteProductController,
   getProductController,
   getProductPhotoController,
   getSingleProductController,
   filterProductController,
   updateProductController,
   countProductController,
   listProductController,
   searchProductController,
   relatedProductController,
   categoryProductController,
   braintreeTokenController,
   braintreePaymentController
} from "../controllers/productController.js";

const router = express.Router();

// Create product
router.post("/create-product", requireSignIn, adminOnly, formidable(), createProductController);

// Get all products
router.get("/get-products", getProductController)

// Get single product
router.get("/get-product/:slug", getSingleProductController)

// Get photo
router.get("/get-product-photo/:pid", getProductPhotoController)

// Delete product
router.delete("/delete-product/:pid", requireSignIn, adminOnly, deleteProductController)

// Update product
router.put("/update-product/:pid", requireSignIn, adminOnly, formidable(), updateProductController)

// Filter product
router.post("/filter-product", filterProductController)

// Count product
router.get("/count-product", countProductController)

// Get product per page
router.get("/list-product/:page", listProductController)

// Search product
router.get("/search/:keyword", searchProductController);

// Similar product
router.get("/related-product/:pid/:cid", relatedProductController)

// Category wise product
router.get("/category-product/:slug", categoryProductController);

// Payment routes
// Token
router.get('/braintree/token', braintreeTokenController)

// Payment
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default router;