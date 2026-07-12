export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import PromotionsManager from "@/components/admin/PromotionsManager";
import type { Promotion } from "@/lib/types";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function PromotionsPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: promotions } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });

  return <PromotionsManager promotions={(promotions as Promotion[]) || []} />;
}
