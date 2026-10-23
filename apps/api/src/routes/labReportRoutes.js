import express from "express";

import {
  getActiveReports,
  getAllReports,
  createReport,
  updateReport,
  deleteReport,
  toggleReportStatus,
} from "../controllers/labReportController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/active", getActiveReports);

router.get("/", authMiddleware, adminMiddleware, getAllReports);
router.post("/", authMiddleware, adminMiddleware, createReport);
router.put("/:id", authMiddleware, adminMiddleware, updateReport);
router.delete("/:id", authMiddleware, adminMiddleware, deleteReport);
router.patch(
  "/:id/toggle",
  authMiddleware,
  adminMiddleware,
  toggleReportStatus
);

export default router;
