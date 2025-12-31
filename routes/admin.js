import express from "express";
import AdminController from "../controllers/adminController.js";
import isAuthenticated, { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply middleware to all routes in this router
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/dashboard", AdminController.dashboard);
router.get("/add-book", AdminController.getAddBook);
router.post("/add-book", AdminController.postAddBook);
router.get("/edit-book/:id", AdminController.getEditBook);
router.post("/edit-book", AdminController.postEditBook);
router.post("/delete-book", AdminController.deleteBook);
router.get("/orders", AdminController.getOrders);
router.post("/delete-order", AdminController.deleteOrder);

export default router;
