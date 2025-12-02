import {
  findReplyFor,
  saveMapping,
  loadAllMappings,
  persistMappings
} from "../services/chatService.js";

import { normalize } from "../utils/normalize.js";

/**
 * pendingTeach is an in-memory map: userId -> pendingUserMsg
 * When a user sends an unknown msg, we store the msg here. The next message
 * from the same user becomes the teacher reply and gets stored permanently.
 *
 * NOTE: pendingTeach lives in memory; if your server restarts you'll lose it.
 * For production, consider storing pending teaches in Redis or DB.
 */
const pendingTeach = new Map();

export async function handleChat(req, res) {
  try {
    const { userId, msg } = req.body;
    if (!userId || !msg) {
      return res.status(400).json({ error: "userId and msg required" });
    }

    const rawMsg = String(msg).trim();
    const key = normalize(rawMsg);

    // If there is a pending teach for this user, treat this msg as the teacher reply
    if (pendingTeach.has(userId)) {
      const originalMsg = pendingTeach.get(userId);
      // Save mapping originalMsg -> this msg
      await saveMapping(originalMsg, rawMsg);
      pendingTeach.delete(userId);

      return res.json({
        reply: "Thanks — I learned that.",
        source: "taught"
      });
    }

    // Try memory
    const reply = await findReplyFor(key);
    if (reply) {
      return res.json({ reply, source: "memory" });
    }

    // Unknown: ask user to teach
    pendingTeach.set(userId, key);
    return res.json({
      reply:
        "I don't know how to answer that. Please teach me by sending the reply you'd like me to use next.",
      source: "ask_teach"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}
