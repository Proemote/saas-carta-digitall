import { CATEGORY_T, DESCRIPTION_T, PRODUCT_T } from "./menu-translations";

export type Lang = "es" | "en" | "fr" | "de";

export const LANGS: Lang[] = ["es", "en", "fr", "de"];

export const dict = {
  es: {
    menu_title: "Nuestra Carta",
    tapas: "Tapa",
    platos: "Plato",
    per_unit: "ud",
    ask_price: "S/P",
    sold_out: "Agotado",
    allergen_title: "Información de alérgenos",
    allergen_note:
      "En cumplimiento del Reglamento (UE) n. 1169/2011 sobre información alimentaria facilitada al consumidor, este establecimiento tiene disponible para su consulta la información relativa a la presencia de alérgenos de nuestros productos. Diríjase a nuestro personal si desea más información al respecto.",
    gluten_free: "Pregunte por nuestro pan y picos sin gluten",
    back_to_top: "Volver arriba",
  },
  en: {
    menu_title: "Our Menu",
    tapas: "Tapa",
    platos: "Full dish",
    per_unit: "unit",
    ask_price: "Ask staff",
    sold_out: "Sold out",
    allergen_title: "Allergen information",
    allergen_note:
      "In compliance with Regulation (EU) No. 1169/2011 on food information to consumers, allergen information for our products is available upon request. Please ask our staff for more details.",
    gluten_free: "Ask about our gluten-free bread and breadsticks",
    back_to_top: "Back to top",
  },
  fr: {
    menu_title: "Notre Carte",
    tapas: "Tapa",
    platos: "Plat",
    per_unit: "pce",
    ask_price: "Sur demande",
    sold_out: "Épuisé",
    allergen_title: "Information sur les allergènes",
    allergen_note:
      "Conformément au règlement (UE) n° 1169/2011 concernant l'information des consommateurs sur les denrées alimentaires, les informations relatives à la présence d'allergènes dans nos produits sont disponibles sur demande. Adressez-vous à notre personnel pour plus de détails.",
    gluten_free: "Demandez notre pain et nos picos sans gluten",
    back_to_top: "Retour en haut",
  },
  de: {
    menu_title: "Unsere Karte",
    tapas: "Tapa",
    platos: "Teller",
    per_unit: "Stk",
    ask_price: "Auf Anfrage",
    sold_out: "Ausverkauft",
    allergen_title: "Allergen-Informationen",
    allergen_note:
      "Gemäß der Verordnung (EU) Nr. 1169/2011 betreffend die Information der Verbraucher über Lebensmittel stehen Ihnen Informationen über Allergene in unseren Produkten auf Anfrage zur Verfügung. Bitte wenden Sie sich an unser Personal.",
    gluten_free: "Fragen Sie nach unserem glutenfreien Brot und Picos",
    back_to_top: "Nach oben",
  },
} as const;

/* Prioridad: columna de BD → diccionario local (respaldo/fallback) → español. */

type NameCols = {
  name: string;
  name_en: string | null;
  name_fr?: string | null;
  name_de?: string | null;
};

const dbName = (o: NameCols, lang: Exclude<Lang, "es">) =>
  ({ en: o.name_en, fr: o.name_fr, de: o.name_de }[lang]);

export function catName(c: NameCols, lang: Lang) {
  if (lang === "es") return c.name;
  return dbName(c, lang) ?? CATEGORY_T[c.name]?.[lang] ?? c.name;
}

export function prodName(p: NameCols, lang: Lang) {
  if (lang === "es") return p.name;
  return dbName(p, lang) ?? PRODUCT_T[p.name]?.[lang] ?? p.name;
}

export function prodDesc(
  p: {
    description: string | null;
    description_en: string | null;
    description_fr?: string | null;
    description_de?: string | null;
  },
  lang: Lang
) {
  if (lang === "es" || !p.description) return p.description;
  const db = { en: p.description_en, fr: p.description_fr, de: p.description_de }[lang];
  return db ?? DESCRIPTION_T[p.description]?.[lang] ?? p.description;
}
