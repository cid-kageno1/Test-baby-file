import express from "express";
import { handleChat } from "../controllers/chatController.js";

const router = express.Router();

/**
 * POST /api/chat
 * body: { userId: string, msg: string }
 * returns: { reply: string, source: "memory"|"ask_teach"|"taught" }
 */
router.post("/chat", handleChat);

export default router;
