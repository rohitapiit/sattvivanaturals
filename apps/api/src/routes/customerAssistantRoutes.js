
import express from "express";
import { customerChat } from "../controllers/customerAssistantController.js";

const router = express.Router();

router.post("/chat", customerChat);

export default router;
