# ShadowGPT-lite (no AI) — auto-learning chat API

## What it is
A small Express API that replies from memory and learns directly from the chat flow. When it doesn't know an answer, it asks the user to teach it; the next message from that user is stored as the reply.

## Run locally
1. `cp .env.example .env`
2. `npm install`
3. `npm start` (or `npm run dev`)

## API
### POST /api/chat
Body:
```json
{ "userId": "browser-or-user-id", "msg": "hello" }
