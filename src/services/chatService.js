import fs from "fs";
import path from "path";
import { normalize } from "../utils/normalize.js";

const DATA_FILE = process.env.DATA_FILE || "./src/data/messages.json";

/**
 * Data format stored in JSON:
 * {
 *   "<normalized input>": ["reply1", "reply2", ...],
 *   ...
 * }
 *
 * This is a simple persistence layer using a JSON file.
 * For production use replace with MongoDB / Postgres / DynamoDB / etc.
 */

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}), "utf8");
}

export async function loadAllMappings() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw || "{}");
}

export async function persistMappings(obj) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), "utf8");
}

export async function findReplyFor(normalizedInput) {
  const all = await loadAllMappings();
  const replies = all[normalizedInput];
  if (!replies || replies.length === 0) return null;
  // simple rotation/random pick
  return replies[Math.floor(Math.random() * replies.length)];
}

export async function saveMapping(inputRaw, replyRaw) {
  const all = await loadAllMappings();
  const key = normalize(inputRaw);
  const reply = String(replyRaw).trim();
  if (!reply) return;
  if (!all[key]) all[key] = [];
  // avoid duplicate identical reply
  if (!all[key].includes(reply)) {
    all[key].push(reply);
    await persistMappings(all);
  }
}
