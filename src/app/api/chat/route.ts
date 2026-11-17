import { NextResponse } from "next/server";
import { getSettings } from "@/lib/content";
import {
  getChatbotKnowledge,
  handoffReply,
  ruleBasedReply,
  type ChatReply,
} from "@/lib/chatbot";
import { isSameOrigin, jsonError, requestIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { chatRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Invalid request origin.", 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid chat request.");
  }

  const ip = requestIp(request);
  const sessionLimit = rateLimit(`demo-chat:${ip}:${parsed.data.sessionId}`, {
    limit: 15,
    windowMs: 60 * 1000,
  });
  if (!sessionLimit.success) {
    return jsonError("You are sending messages too quickly. Please wait a moment.", 429);
  }
  const ipLimit = rateLimit(`demo-chat-ip:${ip}`, { limit: 60, windowMs: 10 * 60 * 1000 });
  if (!ipLimit.success) {
    return jsonError("Chat is temporarily unavailable from this connection. Please try later.", 429);
  }

  let settings;
  try {
    settings = await getSettings();
  } catch {
    return jsonError("The chat is not available right now.", 503);
  }
  if (!settings.chatbotEnabled) {
    return jsonError("The chat assistant is currently disabled. Please use the contact form.", 503);
  }

  const { message, language } = parsed.data;
  const knowledge = await getChatbotKnowledge();

  // The demo is intentionally deterministic: no external AI provider is called
  // and no transcript is persisted.
  const reply: ChatReply =
    settings.chatbotMode === "HUMAN"
      ? handoffReply(knowledge, language)
      : ruleBasedReply({ message, language, knowledge });

  return NextResponse.json(
    {
      ok: true,
      reply: reply.reply,
      mode: reply.mode,
      links: reply.links,
      quickReplies: reply.quickReplies,
      demo: true,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
