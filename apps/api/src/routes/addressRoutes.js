import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  addAddress
);

router.get(
  "/",
  authMiddleware,
  getMyAddresses
);

router.put(
  "/:id",
  authMiddleware,
  updateAddress
);

router.delete(
  "/:id",
  authMiddleware,
  deleteAddress
);

router.put(
  "/:id/default",
  authMiddleware,
  setDefaultAddress
);

export default router;