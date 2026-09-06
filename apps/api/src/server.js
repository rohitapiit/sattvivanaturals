import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import reviewUploadRoutes from "./routes/reviewUploadRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import guestReviewRoutes from "./routes/guestReviewRoutes.js";

import { getShiprocketToken } from "./utils/shiprocket.js";

// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:3002",
      "http://localhost:3000",
      "https://sattvivanaturals.com",
      "https://www.sattvivanaturals.com",
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/addresses", addressRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/review-upload", reviewUploadRoutes);

app.use("/api/banners", bannerRoutes);

app.use(
  "/api/guest-reviews",
  guestReviewRoutes
);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SattViva API Running",
  });
});

// ==========================================
// SHIPROCKET TEST
// ==========================================

console.log("ABOUT TO TEST SHIPROCKET");

getShiprocketToken()
  .then((token) => {
    console.log(
      "SHIPROCKET TEST SUCCESS:",
      !!token
    );
  })
  .catch((error) => {
    console.error(
      "SHIPROCKET TEST FAILED:",
      error.response?.data ||
        error.message
    );
  });

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});