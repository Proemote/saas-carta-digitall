export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ReservationsView from "@/components/admin/ReservationsView";
import type { Reservation } from "@/lib/types";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function ReservationsPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: reservations } = await supabase.from("reservations").select("*").order("date", { ascending: false });

  return <ReservationsView reservations={(reservations as Reservation[]) || []} />;
}
