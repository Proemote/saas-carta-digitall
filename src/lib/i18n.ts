export type Lang = "es" | "en";

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
} as const;

export function catName(c: { name: string; name_en: string | null }, lang: Lang) {
  return lang === "en" && c.name_en ? c.name_en : c.name;
}

export function prodName(p: { name: string; name_en: string | null }, lang: Lang) {
  return lang === "en" && p.name_en ? p.name_en : p.name;
}

export function prodDesc(
  p: { description: string | null; description_en: string | null },
  lang: Lang
) {
  return lang === "en" && p.description_en ? p.description_en : p.description;
}
