import express from "express";
import OrderController from "../controllers/orderController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", OrderController.getUserOrders);

export default router;
