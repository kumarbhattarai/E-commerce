import express from "express"
import BookController from "../controllers/bookController.js"
import isAuthenticated from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/:id", [isAuthenticated, BookController.getDetails])

export default router