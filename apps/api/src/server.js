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
import abandonedCartRoutes from "./routes/abandonedCartRoutes.js";
import labReportRoutes from "./routes/labReportRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:5173",
      "https://sattvivanaturals.com",
      "https://www.sattvivanaturals.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

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
app.use("/api/guest-reviews", guestReviewRoutes);
app.use("/api/abandoned-carts", abandonedCartRoutes);
app.use("/api/lab-reports", labReportRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "SattViva API Running" });
});

// Lightweight health endpoint for uptime monitoring and Render health checks.
// Keep this endpoint fast and independent of MongoDB so it can confirm that
// the Node/Express process is accepting HTTP requests.
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "SattViva API",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("API ERROR:", err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  try {
    console.log("=================================");
    console.log("STARTING SATTVIVA API...");
    console.log("=================================");

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from apps/api/.env");
    }

    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("MongoDB connection successful.");

    const server = app.listen(PORT, () => {
      console.log("=================================");
      console.log(`SattViva API running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
      console.log("=================================");
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down server...`);
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("=================================");
    console.error("SERVER STARTUP FAILED:");
    console.error(error);
    console.error("=================================");
    process.exit(1);
  }
};

startServer();
