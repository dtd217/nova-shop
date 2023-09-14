import express from "express";
import {
   registerController,
   loginController,
   testController,
   updateProfileController,
   getOrdersController,
   getAllOrdersController,
   getAllUsersController,
   orderStatusController
} from "../controllers/authController.js";
import { requireSignIn, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", registerController)

// LOGIN
router.post("/login", loginController)

// TEST
router.get("/test", requireSignIn, adminOnly, testController)

// PROCTECTED ROUTES
router.get('/user-auth', requireSignIn, (req, res) => {
   res.status(200).send({ ok: true })
})

// PROTECTED ADMIN ROUTE
router.get('/admin-auth', requireSignIn, adminOnly, (req, res) => {
   res.status(200).send({ ok: true })
})

// UPDATE PROFILE
router.put('/profile', requireSignIn, updateProfileController)

// ORDERS
router.get('/orders', requireSignIn, getOrdersController)

// ALL ORDERS
router.get('/all-orders', requireSignIn, adminOnly, getAllOrdersController)

// ALL USERS
router.get('/all-users', requireSignIn, adminOnly, getAllUsersController)

// ORDER STATUS
router.put('/order-status/:orderId', requireSignIn, adminOnly, orderStatusController)

export default router