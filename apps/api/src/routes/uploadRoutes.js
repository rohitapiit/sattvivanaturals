import express from "express";
import multer from "multer";

import cloudinary from "../config/cloudinary.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// MULTER CONFIG
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ==========================================
// CLOUDINARY UPLOAD HELPER
// ==========================================

const uploadToCloudinary = (
  file,
  folder
) => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder,
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      uploadStream.end(file.buffer);
    }
  );
};

// ==========================================
// PRODUCT IMAGE UPLOAD
// POST /api/upload
// ==========================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image is required.",
        });
      }

      const result =
        await uploadToCloudinary(
          req.file,
          "sattviva-products"
        );

      res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error(
        "PRODUCT UPLOAD ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to upload product image.",
      });
    }
  }
);

// ==========================================
// BANNER IMAGE UPLOAD
// POST /api/upload/banner
// ==========================================

router.post(
  "/banner",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Banner image is required.",
        });
      }

      const result =
        await uploadToCloudinary(
          req.file,
          "sattviva-banners"
        );

      res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error(
        "BANNER UPLOAD ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to upload banner image.",
      });
    }
  }
);

export default router;