import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import express from "express";

const app = express();
const PORT = 8787;

const BASE_SYSTEM =
  "You are a sales-call copilot for Ketryx. Provide concise, on-brand talking points. Output 4-6 bullets max. Keep under ~80 words. No fluff. If uncertain, say what you'd ask next. Use the knowledge base below to ground your answers; cite specifics (e.g. use cases, case studies, differentiators) when relevant.";

const contextPath = path.join(__dirname, "..", "context.md");
let RAG_SYSTEM = BASE_SYSTEM;
try {
  const rag = fs.readFileSync(contextPath, "utf8");
  RAG_SYSTEM = `${BASE_SYSTEM}\n\n---\n\nKnowledge base (use this to ground your answers):\n\n${rag}`;
} catch (_) {
  // no context.md or unreadable; use base prompt only
}

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.post("/api/claude", async (req, res) => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "Server misconfiguration: CLAUDE_API_KEY is not set. Add it to .env.",
    });
    return;
  }

  const { question, context } = req.body ?? {};
  const q = typeof question === "string" ? question.trim() : "";
  if (!q) {
    res.status(400).json({ error: "Missing or invalid 'question' in request body." });
    return;
  }

  const userContent = context
    ? `${q}\n\nContext: ${typeof context === "string" ? context.trim() : context}`
    : q;

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      system: RAG_SYSTEM,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = message.content?.find((b) => b.type === "text");
    const answer = textBlock?.type === "text" ? textBlock.text.trim() : "";
    res.json({ answer: answer || "No response generated." });
  } catch (err) {
    const status = err.status ?? 502;
    const message = err.message ?? "Upstream error calling Claude.";
    res.status(typeof status === "number" ? status : 502).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Ketryx sales API listening on http://localhost:${PORT}`);
});
