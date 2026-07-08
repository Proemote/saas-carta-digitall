import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import CustomersView from "@/components/admin/CustomersView";
import type { Customer } from "@/lib/types";

export default async function ClientesPage() {
  if (!supabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  return <CustomersView customers={(data as Customer[]) ?? []} />;
}
