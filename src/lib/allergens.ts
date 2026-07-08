import type { Lang } from "./i18n";

/** Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011),
 *  como aparecen en el pie del menú físico. */
export interface AllergenInfo {
  id: string;
  label_es: string;
  label_en: string;
  label_fr: string;
  label_de: string;
  emoji: string;
  color: string;
}

export const ALLERGENS: AllergenInfo[] = [
  { id: "gluten",     label_es: "Cereales con gluten", label_en: "Cereals w/ gluten", label_fr: "Céréales avec gluten", label_de: "Glutenhaltiges Getreide", emoji: "🌾", color: "#C0392B" },
  { id: "crustaceos", label_es: "Crustáceos",          label_en: "Crustaceans",       label_fr: "Crustacés",            label_de: "Krebstiere",              emoji: "🦀", color: "#E74C3C" },
  { id: "huevos",     label_es: "Huevos",              label_en: "Eggs",              label_fr: "Œufs",                 label_de: "Eier",                    emoji: "🥚", color: "#E67E22" },
  { id: "pescado",    label_es: "Pescado",             label_en: "Fish",              label_fr: "Poisson",              label_de: "Fisch",                   emoji: "🐟", color: "#16697A" },
  { id: "cacahuetes", label_es: "Cacahuetes",          label_en: "Peanuts",           label_fr: "Arachides",            label_de: "Erdnüsse",                emoji: "🥜", color: "#8D6E42" },
  { id: "soja",       label_es: "Soja",                label_en: "Soy",               label_fr: "Soja",                 label_de: "Soja",                    emoji: "🌱", color: "#27633C" },
  { id: "lacteos",    label_es: "Lácteos",             label_en: "Dairy",             label_fr: "Lait",                 label_de: "Milch",                   emoji: "🥛", color: "#2471A3" },
  { id: "frutos_cascara", label_es: "Frutos de cáscara", label_en: "Tree nuts",       label_fr: "Fruits à coque",       label_de: "Schalenfrüchte",          emoji: "🌰", color: "#5D4037" },
  { id: "apio",       label_es: "Apio",                label_en: "Celery",            label_fr: "Céleri",               label_de: "Sellerie",                emoji: "🥬", color: "#557A3B" },
  { id: "mostaza",    label_es: "Mostaza",             label_en: "Mustard",           label_fr: "Moutarde",             label_de: "Senf",                    emoji: "🟡", color: "#B7950B" },
  { id: "sesamo",     label_es: "Granos de sésamo",    label_en: "Sesame seeds",      label_fr: "Graines de sésame",    label_de: "Sesamsamen",              emoji: "⚪", color: "#A47E4E" },
  { id: "sulfitos",   label_es: "Sulfitos",            label_en: "Sulphites",         label_fr: "Sulfites",             label_de: "Sulfite",                 emoji: "🍷", color: "#6C3483" },
  { id: "moluscos",   label_es: "Moluscos",            label_en: "Molluscs",          label_fr: "Mollusques",           label_de: "Weichtiere",              emoji: "🐚", color: "#1F618D" },
  { id: "altramuces", label_es: "Altramuces",          label_en: "Lupin",             label_fr: "Lupin",                label_de: "Lupinen",                 emoji: "🫘", color: "#CA6F1E" },
];

export const allergenById = (id: string) => ALLERGENS.find((a) => a.id === id);

export const allergenLabel = (a: AllergenInfo, lang: Lang) =>
  ({ es: a.label_es, en: a.label_en, fr: a.label_fr, de: a.label_de }[lang]);
