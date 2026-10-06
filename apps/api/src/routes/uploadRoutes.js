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


// ==========================================
// LAB REPORT PDF UPLOAD
// POST /api/upload/lab-report
// ==========================================

router.post(
  "/lab-report",
  authMiddleware,
  adminMiddleware,
  upload.single("pdf"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "PDF file is required.",
        });
      }

      const isPdf =
        req.file.mimetype === "application/pdf" ||
        req.file.originalname.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed.",
        });
      }

      const safeName = req.file.originalname
        .replace(/\.pdf$/i, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "lab-report";

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "sattviva-lab-reports",
            resource_type: "raw",
            public_id: `${safeName}-${Date.now()}.pdf`,
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      res.status(200).json({
        success: true,
        pdfUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("LAB REPORT PDF UPLOAD ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload lab report PDF.",
      });
    }
  }
);

export default router;