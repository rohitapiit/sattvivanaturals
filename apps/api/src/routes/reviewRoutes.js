import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addReview } from "../controllers/reviewController.js";

const router = express.Router();

// Submit Review
router.post("/", authMiddleware, addReview);

export default router;