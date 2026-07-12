import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import TablesManager from "@/components/admin/TablesManager";
import type { RestaurantTable } from "@/lib/types";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function TablesPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: tables } = await supabase.from("tables").select("*").order("name");

  return <TablesManager tables={(tables as RestaurantTable[]) || []} />;
}
