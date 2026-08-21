import express from "express";

import {
  addGuestReview,
  getGuestReviewByToken,
  addGuestReviewByToken,
} from "../controllers/guestReviewController.js";

const router = express.Router();

router.post("/", addGuestReview);

router.get(
  "/token/:token",
  getGuestReviewByToken
);
router.post(
  "/token/:token",
  addGuestReviewByToken
);
export default router;