import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addReview,
  getMyReview,
  addReviewByToken,
  getReviewByToken,
  updateReview,
  getMyReviews,
  deleteReview,
  getAllProductReviews,
  getCustomerTestimonials,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get(
  "/product/:productId",
  getAllProductReviews
);



// Add Review
router.post(
  "/",
  authMiddleware,
  addReview
);

router.get(
  "/token/:token",
  getReviewByToken
);

router.post(
  "/token/:token",
  addReviewByToken
);

// Get logged-in user's review for a product
router.get(
  "/my/:productId",
  authMiddleware,
  getMyReview
);

// Get all reviews of logged-in user
router.get(
  "/my",
  authMiddleware,
  getMyReviews
);



// Update Review
router.put(
  "/:reviewId",
  authMiddleware,
  updateReview
);

router.get(
  "/customer-testimonials",
  getCustomerTestimonials
);

// Delete Review
router.delete(
  "/:reviewId",
  authMiddleware,
  deleteReview
);
export default router;