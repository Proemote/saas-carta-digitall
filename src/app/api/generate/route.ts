import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

const FORMAT_LABEL: Record<string, string> = {
  reel: "Reel de Instagram",
  post: "Post de feed",
  story: "Story individual",
  story_sequence: "Secuencia de stories",
};

const OBJECTIVE_LABEL: Record<string, string> = {
  atraer: "Atraer nuevos clientes",
  producto: "Destacar un producto de la carta",
  ambiente: "Mostrar el ambiente del local",
  oferta: "Promocionar una oferta o disponibilidad especial",
  marca: "Contenido de marca / storytelling",
};

export async function POST(req: NextRequest) {
  // Solo el negocio autenticado puede generar contenido
  if (supabaseConfigured() && process.env.ADMIN_AUTH_DISABLED !== "true") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Falta ANTHROPIC_API_KEY en las variables de entorno." },
      { status: 500 }
    );
  }

  const { format, objective, context } = await req.json();

  if (!FORMAT_LABEL[format] || !OBJECTIVE_LABEL[objective]) {
    return NextResponse.json({ error: "Parámetros no válidos" }, { status: 400 });
  }

  const client = new Anthropic();

  const system = `Eres el creativo de redes sociales de Bodega Las Tres Carabelas, un bar-restaurante español con identidad marinera y clásica: carabelas históricas, madera, calor y producto de calidad. No es un chiringuito de playa: es un sitio con carácter, que mezcla lo rústico con lo cuidado.

Especialidades reales de la carta (usa solo estas, no inventes):
- Tartar de atún rojo de almadraba, mojama y solomillo de atún de almadraba
- Chacinas ibéricas: jamón de bellota, caña de lomo, queso oveja viejo
- Gildas (anchoa, boquerón, sushi de cecina y huevo), anchoas del Cantábrico
- Guisos caseros: carrillada, albóndigas de chocos, atún al Pedro Ximénez, fabada
- Carnes maduradas 21 días: T-bone y Tomahawk; lomo alto, presa ibérica
- Tostas variadas y montaditos; vinos de la tierra de Bodega César Florido (Chipiona), manzanilla, moscatel y vermut

Tono: cálido, marinero, con carácter. Español de España, cercano pero cuidado. Nada de clichés vacíos ni exceso de emojis.

Responde SIEMPRE con un único objeto JSON válido, sin texto adicional, con esta estructura exacta:
{
  "concepto": "concepto del contenido y por qué engancha (2-4 frases)",
  "guion": "guion del reel o estructura de la secuencia con indicaciones de planos o momentos, formato con saltos de línea",
  "caption": "texto listo para publicar, con saltos de línea y como mucho 2-3 emojis",
  "hashtags": ["#hashtag1", "#hashtag2", "..."]
}`;

  const userPrompt = `Genera una propuesta de contenido:
- Formato: ${FORMAT_LABEL[format]}
- Objetivo: ${OBJECTIVE_LABEL[objective]}
${context ? `- Contexto concreto del negocio esta semana: ${context}` : ""}

Adapta el campo "guion" al formato: si es un post de feed o story individual, describe la imagen o momento a capturar y la composición; si es reel o secuencia de stories, numera los planos/pantallas con su duración aproximada.`;

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      thinking: { type: "adaptive" },
      system,
      messages: [{ role: "user", content: userPrompt }],
    });

    const message = await stream.finalMessage();
    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    // Extrae el JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Respuesta sin JSON válido");
    const result = JSON.parse(jsonMatch[0]);

    // Guarda el histórico si hay BD
    if (supabaseConfigured()) {
      const supabase = await createClient();
      await supabase.from("content_generations").insert({
        format,
        objective,
        context: context || null,
        result,
      });
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Error generando contenido:", err);
    return NextResponse.json(
      { error: "No se pudo generar el contenido. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
