import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { chatbotSystemPrompt } from "@/lib/chatbot";
import {
  getTableAvailability,
  getActivePromotions,
  getCustomerInfo,
  proposeReservation,
  formatTableAvailability,
} from "@/lib/bot-tools";
import type { Lang } from "@/lib/i18n";

const TOOLS: Anthropic.Tool[] = [
  {
    name: "check_table_availability",
    description:
      "Comprueba qué mesas están disponibles para una fecha, hora y número de personas",
    input_schema: {
      type: "object" as const,
      properties: {
        date: {
          type: "string",
          description: "Fecha en formato YYYY-MM-DD",
        },
        time: {
          type: "string",
          description: "Hora en formato HH:MM",
        },
        party_size: {
          type: "number",
          description: "Número de personas",
        },
      },
      required: ["date", "time", "party_size"],
    },
  },
  {
    name: "get_active_promotions",
    description: "Obtiene las promociones activas del restaurante",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_customer_info",
    description: "Obtiene información de un cliente registrado (por teléfono)",
    input_schema: {
      type: "object" as const,
      properties: {
        phone: {
          type: "string",
          description: "Número de teléfono del cliente",
        },
      },
      required: ["phone"],
    },
  },
  {
    name: "propose_reservation",
    description:
      "Propone una reserva (el dueño debe confirmarla después desde el panel)",
    input_schema: {
      type: "object" as const,
      properties: {
        customer_phone: {
          type: "string",
          description: "Teléfono del cliente",
        },
        customer_name: {
          type: "string",
          description: "Nombre del cliente",
        },
        date: {
          type: "string",
          description: "Fecha en formato YYYY-MM-DD",
        },
        time: {
          type: "string",
          description: "Hora en formato HH:MM",
        },
        party_size: {
          type: "number",
          description: "Número de personas",
        },
        table_id: {
          type: "string",
          description: "ID de la mesa (opcional)",
        },
        notes: {
          type: "string",
          description: "Notas adicionales (alergias, preferencias, etc.)",
        },
      },
      required: ["customer_phone", "customer_name", "date", "time", "party_size"],
    },
  },
];

async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "check_table_availability": {
      const available = await getTableAvailability(
        toolInput.date as string,
        toolInput.time as string,
        toolInput.party_size as number
      );
      return formatTableAvailability(available);
    }
    case "get_active_promotions": {
      const proms = await getActivePromotions();
      if (proms.length === 0) return "No hay promociones activas en este momento.";
      return proms
        .map(
          (p) =>
            `**${p.title}**: ${p.description || ""} ${p.discount_text || ""}`
        )
        .join("\n");
    }
    case "get_customer_info": {
      const info = await getCustomerInfo(toolInput.phone as string);
      if (!info)
        return `No encontramos cliente con teléfono ${toolInput.phone}. Es un cliente nuevo.`;
      return `Cliente: ${info.name}. Reservas: ${info.reservations_total} total, ${info.reservations_attended} asistidas (${100 - info.no_show_percentage}% fidelidad). No-shows: ${info.no_show_count}.`;
    }
    case "propose_reservation": {
      const result = await proposeReservation({
        customer_phone: toolInput.customer_phone as string,
        customer_name: toolInput.customer_name as string,
        date: toolInput.date as string,
        time: toolInput.time as string,
        party_size: toolInput.party_size as number,
        table_id: toolInput.table_id as string | undefined,
        notes: toolInput.notes as string | undefined,
      });
      if (result.success) {
        return `Reserva propuesta correctamente (ID: ${result.reservation_id}). El dueño la verá en el panel para confirmar.`;
      } else {
        return `Error al proponer reserva: ${result.error}`;
      }
    }
    default:
      return `Herramienta desconocida: ${toolName}`;
  }
}

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

    // Obtener historial
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

    // Llamar a Claude (con tools)
    let response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system,
      tools: TOOLS,
      messages,
    });

    // Procesar tool calls si los hay
    let assistantMessages: Anthropic.Messages.MessageParam[] = [];
    while (response.stop_reason === "tool_use") {
      assistantMessages.push({
        role: "assistant",
        content: response.content,
      });

      const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = await executeToolCall(
            block.name,
            block.input as Record<string, unknown>
          );
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: String(result),
          });
        }
      }

      assistantMessages.push({
        role: "user",
        content: toolResults,
      });

      // Llamar a Claude de nuevo con los resultados
      response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system,
        tools: TOOLS,
        messages: [...messages, ...assistantMessages],
      });
    }

    // Extraer texto final
    const botMessage =
      response.content.find((b) => b.type === "text")?.text ?? "";

    // Guardar en BD
    if (supabaseConfigured()) {
      const supabase = await createClient();

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
        await supabase
          .from("chatbot_conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", convId);
      }

      if (convId) {
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
