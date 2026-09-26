import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAbandonedCarts,
  getAbandonedCartById,
} from "../controllers/abandonedCartController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAbandonedCarts
);

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getAbandonedCartById
);

export default router;
