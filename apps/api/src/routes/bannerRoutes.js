import express from "express";

import {
  getAllBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from "../controllers/bannerController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC
// ==========================================

// Website Hero ke liye
router.get("/active", getActiveBanners);


// ==========================================
// ADMIN
// ==========================================

// Saare banners
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllBanners
);

// Create
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createBanner
);

// Update
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateBanner
);

// Delete
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteBanner
);

// Activate / Deactivate
router.patch(
  "/:id/toggle",
  authMiddleware,
  adminMiddleware,
  toggleBannerStatus
);

export default router;