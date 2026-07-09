import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import PromotionsManager from "@/components/admin/PromotionsManager";
import type { Promotion } from "@/lib/types";

export default async function PromcionesPage() {
  if (!supabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PromotionsManager promotions={(promotions ?? []) as Promotion[]} />
  );
}
