import type { Category, MenuSection, Product } from "./types";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "./fallback-menu";
import { createClient, supabaseConfigured } from "./supabase/server";

/** Carga categorías y productos (Supabase si está configurado, si no datos locales)
 *  y los organiza en secciones para la carta pública. */
export async function getMenuSections(): Promise<MenuSection[]> {
  let categories: Category[];
  let products: Product[];

  if (supabaseConfigured()) {
    const supabase = await createClient();
    const [catsRes, prodsRes] = await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("products").select("*").order("sort_order"),
    ]);
    categories = (catsRes.data as Category[]) ?? [];
    products = (prodsRes.data as Product[]) ?? [];
    // Si la BD está vacía, usa el fallback para no mostrar una carta en blanco
    if (categories.length === 0) {
      categories = FALLBACK_CATEGORIES;
      products = FALLBACK_PRODUCTS;
    }
  } else {
    categories = FALLBACK_CATEGORIES;
    products = FALLBACK_PRODUCTS;
  }

  const byCategory = (catId: string) =>
    products
      .filter((p) => p.category_id === catId)
      .sort((a, b) => a.sort_order - b.sort_order);

  return categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      category,
      products: byCategory(category.id),
      children: categories
        .filter((c) => c.parent_id === category.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((child) => ({ category: child, products: byCategory(child.id) })),
    }));
}
