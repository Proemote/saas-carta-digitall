/** Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011),
 *  como aparecen en el pie del menú físico. */
export interface AllergenInfo {
  id: string;
  label_es: string;
  label_en: string;
  emoji: string;
  color: string;
}

export const ALLERGENS: AllergenInfo[] = [
  { id: "gluten",     label_es: "Cereales con gluten", label_en: "Cereals w/ gluten", emoji: "🌾", color: "#C0392B" },
  { id: "crustaceos", label_es: "Crustáceos",          label_en: "Crustaceans",       emoji: "🦀", color: "#E74C3C" },
  { id: "huevos",     label_es: "Huevos",              label_en: "Eggs",              emoji: "🥚", color: "#E67E22" },
  { id: "pescado",    label_es: "Pescado",             label_en: "Fish",              emoji: "🐟", color: "#16697A" },
  { id: "cacahuetes", label_es: "Cacahuetes",          label_en: "Peanuts",           emoji: "🥜", color: "#8D6E42" },
  { id: "soja",       label_es: "Soja",                label_en: "Soy",               emoji: "🌱", color: "#27633C" },
  { id: "lacteos",    label_es: "Lácteos",             label_en: "Dairy",             emoji: "🥛", color: "#2471A3" },
  { id: "frutos_cascara", label_es: "Frutos de cáscara", label_en: "Tree nuts",       emoji: "🌰", color: "#5D4037" },
  { id: "apio",       label_es: "Apio",                label_en: "Celery",            emoji: "🥬", color: "#557A3B" },
  { id: "mostaza",    label_es: "Mostaza",             label_en: "Mustard",           emoji: "🟡", color: "#B7950B" },
  { id: "sesamo",     label_es: "Granos de sésamo",    label_en: "Sesame seeds",      emoji: "⚪", color: "#A47E4E" },
  { id: "sulfitos",   label_es: "Sulfitos",            label_en: "Sulphites",         emoji: "🍷", color: "#6C3483" },
  { id: "moluscos",   label_es: "Moluscos",            label_en: "Molluscs",          emoji: "🐚", color: "#1F618D" },
  { id: "altramuces", label_es: "Altramuces",          label_en: "Lupin",             emoji: "🫘", color: "#CA6F1E" },
];

export const allergenById = (id: string) => ALLERGENS.find((a) => a.id === id);
