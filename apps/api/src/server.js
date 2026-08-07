import dotenv from "dotenv";
dotenv.config();
console.log(
  "Cloud:",
  process.env.CLOUDINARY_CLOUD_NAME
);
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


import { getShiprocketToken } from "./utils/shiprocket.js";

console.log("SHIPROCKET IMPORT LOADED");

connectDB();

const app = express();

console.log(
  "RAZORPAY_KEY_ID =",
  process.env.RAZORPAY_KEY_ID
);

console.log(
  "RAZORPAY_KEY_SECRET =",
  process.env.RAZORPAY_KEY_SECRET
);

app.use(cors({
  origin: [
    "http://localhost:3002",
    "http://localhost:3000",
    "https://sattvivanaturals.com",
    "https://www.sattvivanaturals.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
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


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SattViva API Running"
  });
});


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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});