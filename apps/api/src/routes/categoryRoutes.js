import express from "express";
import {createCategory, getCategories, getCategoryById, updateCategory, deleteCategory} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createCategory);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.put("/:id", authMiddleware, adminMiddleware, updateCategory);

router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;