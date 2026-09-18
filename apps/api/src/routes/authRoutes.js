import express from "express";
import { register, login, getProfile, verifyOtp, resendOtp, forgotPassword, resetPassword,} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/profile", authMiddleware, getProfile);

export default router;