import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import SetupNotice from "@/components/admin/SetupNotice";
import ReservationsView from "@/components/admin/ReservationsView";
import type { Reservation } from "@/lib/types";

export default async function ReservasPage() {
  if (!supabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  return <ReservationsView reservations={(data as Reservation[]) ?? []} />;
}
