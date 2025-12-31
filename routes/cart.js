import express from "express";
import CartController from "../controllers/cartController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

// View Cart
router.get("/", CartController.getCart);

// Add item to cart
router.post("/add", isAuthenticated, CartController.addToCart);

// Buy Now (Add to cart & Checkout)
router.post("/buy-now", isAuthenticated, CartController.buyNow);

router.post("/delete-item", CartController.deleteItem);
router.get("/checkout", CartController.checkout);
router.get("/verify-esewa", CartController.verifyEsewa);

export default router;
