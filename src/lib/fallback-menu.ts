import type { Category, Product, PriceType } from "./types";

/** Datos locales de la carta (espejo del seed SQL).
 *  Se usan cuando Supabase aún no está configurado, para que la carta
 *  pública funcione en desarrollo y previews. */

type Cat = [id: string, name: string, name_en: string, slug: string, parent: string | null, order: number];
type Prod = [
  cat: string,
  name: string,
  desc: string | null,
  type: PriceType,
  price: number | null,
  tapa: number | null,
  plato: number | null,
  unit: number | null,
  order: number
];

const C = {
  empezar: "c1", chacinas: "c2", caprichos: "c3", tartar: "c4", almadraba: "c5",
  tostas: "c6", montaditos: "c7", guisos: "c8", carnes: "c9", pescados: "c10",
  postres: "c11", bebidas: "c12", vinos: "c13",
  cervezas: "c12-1", copasvino: "c12-2", refrescos: "c12-3",
  vtierra: "c13-1", vtintos: "c13-2", vblancos: "c13-3", licores: "c13-4",
};

const cats: Cat[] = [
  [C.empezar, "Para Empezar", "To Start", "para-empezar", null, 1],
  [C.chacinas, "Papelones Chacinas", "Cured Meats", "papelones-chacinas", null, 2],
  [C.caprichos, "Caprichos", "Little Treats", "caprichos", null, 3],
  [C.tartar, "Nuestros Tartar", "Our Tartare", "nuestros-tartar", null, 4],
  [C.almadraba, "De Almadraba", "Almadraba Tuna", "de-almadraba", null, 5],
  [C.tostas, "Nuestras Tostas", "Our Toasts", "nuestras-tostas", null, 6],
  [C.montaditos, "Montaditos", "Small Sandwiches", "montaditos", null, 7],
  [C.guisos, "Guisos", "Stews", "guisos", null, 8],
  [C.carnes, "Nuestras Carnes", "Our Meats", "nuestras-carnes", null, 9],
  [C.pescados, "Nuestros Pescados", "Our Fish", "nuestros-pescados", null, 10],
  [C.postres, "Postres", "Desserts", "postres", null, 11],
  [C.bebidas, "Nuestras Bebidas", "Our Drinks", "nuestras-bebidas", null, 12],
  [C.vinos, "Carta de Vinos", "Wine List", "carta-de-vinos", null, 13],
  [C.cervezas, "Cervezas Cruzcampo", "Cruzcampo Beers", "cervezas-cruzcampo", C.bebidas, 1],
  [C.copasvino, "Copas de Vinos", "Wines by the Glass", "copas-de-vinos", C.bebidas, 2],
  [C.refrescos, "Refrescos", "Soft Drinks", "refrescos", C.bebidas, 3],
  [C.vtierra, "Vinos de la Tierra por Copas — Bodega César Florido (Chipiona)", "Local Wines by the Glass — Bodega César Florido (Chipiona)", "vinos-tierra-copas", C.vinos, 1],
  [C.vtintos, "Vinos Tintos por Botellas", "Red Wines by the Bottle", "tintos-botellas", C.vinos, 2],
  [C.vblancos, "Vinos Blancos por Botellas", "White Wines by the Bottle", "blancos-botellas", C.vinos, 3],
  [C.licores, "Copas y Licores", "Spirits & Liqueurs", "copas-licores", C.vinos, 4],
];

const prods: Prod[] = [
  // Para Empezar
  [C.empezar, "Tomate con Lomo Atún", null, "single", 7, null, null, null, 1],
  [C.empezar, "Aceitunas", null, "single", 3, null, null, null, 2],
  [C.empezar, "Torreznos de Soria", null, "single", 7, null, null, null, 3],
  [C.empezar, "Ensalada de Ahumados", null, "single", 10, null, null, null, 4],
  [C.empezar, "Pimientada de Atún", null, "single", 10, null, null, null, 5],
  [C.empezar, "Paté de Ciervo y Pasas", null, "single", 6, null, null, null, 6],
  [C.empezar, "Paté de Queso Azul y Cebolla", null, "single", 6, null, null, null, 7],
  [C.empezar, "Papas Arrugadas", null, "single", 5, null, null, null, 8],
  [C.empezar, "Ensaladilla de la Casa", null, "double", null, 3.5, 7, null, 9],
  [C.empezar, "Patatas Aliñadas con Lomo de Atún", null, "double", null, 3.5, 7, null, 10],
  // Papelones Chacinas
  [C.chacinas, "Jamón Bellota", null, "single", 19, null, null, null, 1],
  [C.chacinas, "Caña de Lomo Bellota", null, "single", 15, null, null, null, 2],
  [C.chacinas, "Taquitos de Jamón", null, "single", 4, null, null, null, 3],
  [C.chacinas, "Salchichón", null, "double", null, 4, 7.5, null, 4],
  [C.chacinas, "Morcilla de Hígado", null, "double", null, 3.5, 6.5, null, 5],
  [C.chacinas, "Queso Oveja Viejo", null, "double", null, 3.5, 10.5, null, 6],
  // Caprichos
  [C.caprichos, "Pata de Pulpo", null, "single", 17, null, null, null, 1],
  [C.caprichos, "Boquerones en Vinagre", null, "double", null, 3.5, 7, null, 2],
  [C.caprichos, "Anchoas del Cantábrico", null, "per_unit", null, null, null, 1.8, 3],
  [C.caprichos, "Gildas Anchoas", null, "per_unit", null, null, null, 1.5, 4],
  [C.caprichos, "Gildas de Boquerón", null, "per_unit", null, null, null, 1.8, 5],
  [C.caprichos, "Gildas de Sushi Cecina Huevo", null, "per_unit", null, null, null, 2.2, 6],
  // Tartar
  [C.tartar, "Tartar de Atún Rojo de Almadraba", null, "single", 12, null, null, null, 1],
  [C.tartar, "Tartar de Salmón", null, "single", 12, null, null, null, 2],
  [C.tartar, "Steak Tartar", null, "single", 12, null, null, null, 3],
  // De Almadraba
  [C.almadraba, "Tarantelo", null, "no_price", null, null, null, null, 1],
  [C.almadraba, "Solomillo de Atún Almadraba", null, "per_unit", null, null, null, 3.5, 2],
  [C.almadraba, "Mojama de Almadraba", null, "double", null, 3.5, 10, null, 3],
  // Tostas
  [C.tostas, "Sardinas Anchoadas y Queso Viejo", null, "single", 7, null, null, null, 1],
  [C.tostas, "Rulo de Cabra con Miel y Nueces", null, "single", 7, null, null, null, 2],
  [C.tostas, "Boquerón Aguacate", null, "single", 7, null, null, null, 3],
  [C.tostas, "Salmón Aguacate", null, "single", 7, null, null, null, 4],
  [C.tostas, "Gulas con Salmorejo", null, "single", 7, null, null, null, 5],
  [C.tostas, "Bacalao con Salmorejo", null, "single", 7, null, null, null, 6],
  [C.tostas, "Sardina Anchoadas Aguacate", null, "single", 7, null, null, null, 7],
  [C.tostas, "Ahumados Aguacate", null, "single", 7, null, null, null, 8],
  [C.tostas, "Rulo de Cabra con Arándanos", null, "single", 7, null, null, null, 9],
  // Montaditos
  [C.montaditos, "Mini Hamburguesa", null, "per_unit", null, null, null, 3.5, 1],
  [C.montaditos, "Solomillo al Whisky", null, "per_unit", null, null, null, 3.5, 2],
  [C.montaditos, "Melva con Pimientos Morrones", null, "per_unit", null, null, null, 3.5, 3],
  [C.montaditos, "Chorizo Picante", null, "per_unit", null, null, null, 3.5, 4],
  [C.montaditos, "Salmón con Philadelphia", null, "per_unit", null, null, null, 3.5, 5],
  [C.montaditos, "Pringa", null, "per_unit", null, null, null, 3.5, 6],
  // Guisos
  [C.guisos, "Atún al Pedro Jiménez", null, "single", 12, null, null, null, 1],
  [C.guisos, "Atún Encebollado", null, "single", 12, null, null, null, 2],
  [C.guisos, "Fabada Asturiana", null, "single", 10, null, null, null, 3],
  [C.guisos, "Carrillada", null, "double", null, 5, 15, null, 4],
  [C.guisos, "Albóndigas de Chocos", null, "double", null, 4, 12, null, 5],
  // Carnes
  [C.carnes, "Lomo Bajo 300gr aprox.", null, "single", 16, null, null, null, 1],
  [C.carnes, "Lomo Alto 400gr aprox.", null, "single", 23, null, null, null, 2],
  [C.carnes, "Solomillo Ternera 200gr aprox.", null, "single", 20, null, null, null, 3],
  [C.carnes, "Presa Ibérica", null, "single", 17, null, null, null, 4],
  [C.carnes, "Solomillo de Cerdo", null, "single", 12, null, null, null, 5],
  [C.carnes, "Costillas Salsa Barbacoa", null, "single", 12, null, null, null, 6],
  [C.carnes, "Brocheta de Solomillo", null, "single", 12, null, null, null, 7],
  [C.carnes, "Churrasco de Pollo", null, "single", 6, null, null, null, 8],
  [C.carnes, "T-bone", "21 días de maduración", "no_price", null, null, null, null, 9],
  [C.carnes, "Tomahawk", "21 días de maduración", "no_price", null, null, null, null, 10],
  // Pescados
  [C.pescados, "Bacalao bañado en salsa gourmet", null, "single", 14, null, null, null, 1],
  [C.pescados, "Salmón", null, "single", 10, null, null, null, 2],
  // Postres
  [C.postres, "Tarta", "Consultar", "no_price", null, null, null, null, 1],
  [C.postres, "Pionono", null, "single", 5, null, null, null, 2],
  // Bebidas: cervezas
  [C.cervezas, "Copa", null, "single", 1.9, null, null, null, 1],
  [C.cervezas, "Cortada", null, "single", 1.7, null, null, null, 2],
  [C.cervezas, "Maceta", null, "single", 3, null, null, null, 3],
  [C.cervezas, "Botellín", null, "single", 1.5, null, null, null, 4],
  [C.cervezas, "Tercio", null, "single", 2, null, null, null, 5],
  [C.cervezas, "Heineken 0,0", null, "single", 2, null, null, null, 6],
  [C.cervezas, "Radler", null, "single", 2, null, null, null, 7],
  [C.cervezas, "Sin Gluten", null, "single", 2, null, null, null, 8],
  // Bebidas: copas de vino
  [C.copasvino, "Rioja", null, "single", 2.7, null, null, null, 1],
  [C.copasvino, "Ribera", null, "single", 2.7, null, null, null, 2],
  [C.copasvino, "Verdejo", null, "single", 2.7, null, null, null, 3],
  [C.copasvino, "Semidulce", null, "single", 2.7, null, null, null, 4],
  [C.copasvino, "Frizante", null, "single", 2.7, null, null, null, 5],
  [C.copasvino, "Tintos de Verano", null, "single", 1.8, null, null, null, 6],
  // Bebidas: refrescos
  [C.refrescos, "Coca Cola", null, "single", 1.7, null, null, null, 1],
  [C.refrescos, "Naranja", null, "single", 1.7, null, null, null, 2],
  [C.refrescos, "Limón", null, "single", 1.7, null, null, null, 3],
  [C.refrescos, "Nestea", null, "single", 2, null, null, null, 4],
  [C.refrescos, "Aquarius", null, "single", 2, null, null, null, 5],
  [C.refrescos, "Zumos", null, "single", 1.5, null, null, null, 6],
  [C.refrescos, "Agua con/sin gas", null, "single", 1.5, null, null, null, 7],
  [C.refrescos, "Casera Blanca", null, "single", 1.5, null, null, null, 8],
  // Vinos
  [C.vtierra, "Manzanilla", null, "single", 1.8, null, null, null, 1],
  [C.vtierra, "Moscatel Especial", null, "single", 1.8, null, null, null, 2],
  [C.vtierra, "Moscatel Dorado", null, "single", 1.8, null, null, null, 3],
  [C.vtierra, "Moscatel de Pasas", null, "single", 2.8, null, null, null, 4],
  [C.vtierra, "Vermut", null, "single", 2.8, null, null, null, 5],
  [C.vtintos, "Vino de la Casa", null, "single", 14.5, null, null, null, 1],
  [C.vtintos, "Luis Cañas Crianza", "D.O. Ca. Rioja", "single", 25, null, null, null, 2],
  [C.vtintos, "Colonia 40", "Cazalla de la Sierra", "single", 20, null, null, null, 3],
  [C.vtintos, "LAN Crianza", "D.O. Ca. Rioja", "single", 18, null, null, null, 4],
  [C.vtintos, "Aparicio", "Ribera del Duero", "single", 16, null, null, null, 5],
  [C.vtintos, "López de Haro Reserva", "D.O. Ca. Rioja", "single", 14, null, null, null, 6],
  [C.vblancos, "Manijero", "V.T. Cádiz", "single", 14, null, null, null, 1],
  [C.vblancos, "Aparicio", "Verdejo", "single", 14, null, null, null, 2],
  [C.vblancos, "Bicos", "D.O. Rías Baixas", "single", 15, null, null, null, 3],
  [C.licores, "Combinados", null, "single", 6, null, null, null, 1],
  [C.licores, "Combinados Prémium", null, "single", 9, null, null, null, 2],
  [C.licores, "Licores", null, "single", 5, null, null, null, 3],
];

export const FALLBACK_CATEGORIES: Category[] = cats.map(
  ([id, name, name_en, slug, parent_id, sort_order]) => ({
    id, name, name_en, name_fr: null, name_de: null,
    slug, parent_id, sort_order, is_active: true,
  })
);

export const FALLBACK_PRODUCTS: Product[] = prods.map(
  ([category_id, name, description, price_type, price, price_tapa, price_plato, price_unit, sort_order], i) => ({
    id: `p${i + 1}`,
    category_id,
    name,
    name_en: null,
    name_fr: null,
    name_de: null,
    description,
    description_en: null,
    description_fr: null,
    description_de: null,
    image_url: null,
    price_type,
    price,
    price_tapa,
    price_plato,
    price_unit,
    allergens: [],
    is_available: true,
    sort_order,
  })
);
