import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/content";
import {
  generateAiReply,
  getChatbotKnowledge,
  getConversationHistory,
  handoffReply,
  quickReplies,
  requiresDeterministicAnswer,
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
  const sessionLimit = rateLimit(`chat:${ip}:${parsed.data.sessionId}`, {
    limit: 15,
    windowMs: 60 * 1000,
  });
  if (!sessionLimit.success) {
    return jsonError("You are sending messages too quickly. Please wait a moment.", 429);
  }
  const ipLimit = rateLimit(`chat-ip:${ip}`, { limit: 60, windowMs: 10 * 60 * 1000 });
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

  const { sessionId, message, language } = parsed.data;

  try {
    const knowledge = await getChatbotKnowledge();
    const conversation = await db.chatConversation.upsert({
      where: { sessionId },
      create: {
        sessionId,
        language,
        mode: settings.chatbotMode,
        summary: message.slice(0, 180),
      },
      update: { language },
    });

    await db.chatMessage.create({
      data: { conversationId: conversation.id, sender: "VISITOR", content: message },
    });

    let reply: ChatReply | null = null;

    if (settings.chatbotMode === "HUMAN") {
      reply = handoffReply(knowledge, language);
    } else if (settings.chatbotMode === "AI" && process.env.OPENAI_API_KEY) {
      // High-risk questions (tax rates, deadlines, legal positions, credentials)
      // always receive a deterministic, safety-reviewed answer instead of AI output.
      if (requiresDeterministicAnswer(message)) {
        reply = ruleBasedReply({ message, language, knowledge });
      }
    }

    if (!reply && settings.chatbotMode === "AI" && process.env.OPENAI_API_KEY) {
      const history = await getConversationHistory(conversation.id);
      const aiReply = await generateAiReply({ knowledge, history, language });
      if (aiReply) {
        reply = {
          reply: aiReply,
          mode: "AI",
          links: [],
          quickReplies: quickReplies(language),
        };
      }
    }

    if (!reply) {
      reply = ruleBasedReply({ message, language, knowledge });
    }

    await db.chatMessage.create({
      data: { conversationId: conversation.id, sender: "ASSISTANT", content: reply.reply },
    });
    await db.chatConversation.update({
      where: { id: conversation.id },
      data: { mode: reply.mode },
    });

    return NextResponse.json(
      {
        ok: true,
        reply: reply.reply,
        mode: reply.mode,
        links: reply.links,
        quickReplies: reply.quickReplies,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Chat request failed", error);
    return jsonError("The assistant could not respond. Please try again or use the contact form.", 500);
  }
}
