import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "sattviva-products",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(req.file.buffer);
        }
      );

      res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;