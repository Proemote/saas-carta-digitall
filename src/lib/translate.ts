import Anthropic from "@anthropic-ai/sdk";

/** Traducciones EN/FR/DE generadas con Claude para nombres y descripciones
 *  de la carta. Devuelve null si no hay API key o si algo falla: guardar el
 *  plato nunca debe romperse por la traducción (se mostrará en español). */

export interface MenuItemTranslations {
  name_en: string | null;
  name_fr: string | null;
  name_de: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_de: string | null;
}

const SYSTEM = `Eres traductor gastronómico de la carta de un bar-restaurante andaluz tradicional ("Bodega Las Tres Carabelas").
Traduce nombres de platos y descripciones del español a inglés, francés y alemán, como aparecerían en una carta impresa de calidad.

Reglas:
- Nombres propios, marcas, vinos y denominaciones de origen NO se traducen (Rioja, Cruzcampo, Manzanilla, Pedro Ximénez, D.O., nombres de bodegas…): devuélvelos tal cual.
- Platos muy locales sin traducción directa (pringa, gilda, mojama, tarantelo…): conserva el nombre y añade una aclaración breve entre paréntesis.
- Sé fiel y sobrio: nada de florituras de marketing.

Responde SOLO con JSON válido, sin markdown:
{"name":{"en":"…","fr":"…","de":"…"},"description":{"en":"…","fr":"…","de":"…"}}
Si no se pasa descripción, devuelve "description" con valores null.`;

export async function translateMenuItem(
  name: string,
  description: string | null
): Promise<MenuItemTranslations | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const anthropic = new Anthropic();
    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: JSON.stringify({ name, description }),
        },
      ],
    });
    const text = res.content.find((b) => b.type === "text")?.text ?? "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    return {
      name_en: json.name?.en ?? null,
      name_fr: json.name?.fr ?? null,
      name_de: json.name?.de ?? null,
      description_en: description ? json.description?.en ?? null : null,
      description_fr: description ? json.description?.fr ?? null : null,
      description_de: description ? json.description?.de ?? null : null,
    };
  } catch (e) {
    console.error("translateMenuItem:", e);
    return null;
  }
}

/** Traducción de nombre de categoría (mismo criterio, sin descripción). */
export async function translateCategoryName(
  name: string
): Promise<{ name_en: string | null; name_fr: string | null; name_de: string | null } | null> {
  const t = await translateMenuItem(name, null);
  return t && { name_en: t.name_en, name_fr: t.name_fr, name_de: t.name_de };
}
