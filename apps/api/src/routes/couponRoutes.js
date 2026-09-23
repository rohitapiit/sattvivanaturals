import express from "express";

import {createCoupon, getVisibleCoupons, applyCoupon,  getAllCoupons, updateCoupon, deleteCoupon,} from "../controllers/couponController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCoupon
);

router.get(
  "/",
  getVisibleCoupons
);

router.post(
  "/apply",
  applyCoupon
);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAllCoupons
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCoupon
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCoupon
);
export default router;