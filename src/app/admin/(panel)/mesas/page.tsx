import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import TablesManager from "@/components/admin/TablesManager";
import type { RestaurantTable } from "@/lib/types";

export default async function MesasPage() {
  if (!supabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const { data: tables } = await supabase
    .from("tables")
    .select("*")
    .order("name");

  return (
    <TablesManager tables={(tables ?? []) as RestaurantTable[]} />
  );
}
