import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import MenuManager from "@/components/admin/MenuManager";
import type { Category, Product } from "@/lib/types";

export default async function CartaAdminPage() {
  if (!supabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const [catsRes, prodsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order"),
  ]);

  return (
    <MenuManager
      categories={(catsRes.data as Category[]) ?? []}
      products={(prodsRes.data as Product[]) ?? []}
    />
  );
}
