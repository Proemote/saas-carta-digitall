import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { chatbotSystemPrompt } from "@/lib/chatbot";
import type { Lang } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key no configurada" },
      { status: 500 }
    );
  }

  try {
    const { message, lang, conversation_id, customer_phone } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mensaje vacío" },
        { status: 400 }
      );
    }

    const langVal = (["es", "en", "fr", "de"] as Lang[]).includes(lang as Lang)
      ? (lang as Lang)
      : "es";

    const anthropic = new Anthropic();
    const system = await chatbotSystemPrompt(langVal);

    // Obtener historial si existe conversation_id
    let messages: Anthropic.Messages.MessageParam[] = [
      { role: "user", content: message },
    ];
    let convId = conversation_id;

    if (supabaseConfigured() && convId) {
      const supabase = await createClient();
      const { data: hist } = await supabase
        .from("chatbot_messages")
        .select("role, content")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (hist && hist.length > 0) {
        messages = [
          ...(hist as Anthropic.Messages.MessageParam[]),
          { role: "user", content: message },
        ];
      }
    }

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system,
      messages,
    });

    const botMessage =
      response.content.find((b) => b.type === "text")?.text ?? "";

    // Guardar en BD si está configurada
    if (supabaseConfigured()) {
      const supabase = await createClient();

      // Crear o recuperar conversación
      if (!convId) {
        const { data: newConv } = await supabase
          .from("chatbot_conversations")
          .insert({
            customer_phone: customer_phone ?? null,
            started_at: new Date().toISOString(),
            last_message_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        convId = newConv?.id;
      } else {
        // Actualizar last_message_at
        await supabase
          .from("chatbot_conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", convId);
      }

      if (convId) {
        // Guardar los dos mensajes (usuario y bot)
        await Promise.all([
          supabase.from("chatbot_messages").insert({
            conversation_id: convId,
            role: "user",
            content: message,
          }),
          supabase.from("chatbot_messages").insert({
            conversation_id: convId,
            role: "bot",
            content: botMessage,
          }),
        ]);
      }
    }

    return NextResponse.json({
      response: botMessage,
      conversation_id: convId,
    });
  } catch (error) {
    console.error("/api/chat:", error);
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    );
  }
}
