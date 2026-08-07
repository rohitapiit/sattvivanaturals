import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateTrackingNumber,
  createRazorpayOrder,
  cancelOrder,
  returnOrder,
  replaceOrder,
  createBuyNowOrder,
  downloadInvoice,
} from "../controllers/orderController.js";

import authMiddleware, {
  optionalAuthMiddleware,
} from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";





const router = express.Router();

router.post(
  "/",
  optionalAuthMiddleware,
  createOrder
);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// Used by the success page to poll for Shiprocket order/shipment IDs,
// which are created in the background after the order response.
router.get("/:id", optionalAuthMiddleware, getOrderById);

router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

router.put("/:id/tracking", authMiddleware, adminMiddleware, updateTrackingNumber);

router.post(
  "/create-razorpay-order",
  optionalAuthMiddleware,
  createRazorpayOrder
);

router.put(
    "/:id/cancel",
    authMiddleware,
    cancelOrder
  );


  router.post(
    "/buy-now",
    optionalAuthMiddleware,
    createBuyNowOrder
  );

  router.put(
    "/:id/return",
    authMiddleware,
    returnOrder
  );
  
  router.put(
    "/:id/replace",
    authMiddleware,
    replaceOrder
  );

  router.get(
  "/:id/invoice",
  authMiddleware,
  downloadInvoice
);
export default router;