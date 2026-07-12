import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import CustomersView from "@/components/admin/CustomersView";
import type { Customer } from "@/lib/types";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function CustomersPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: customers } = await supabase.from("customers").select("*");

  return <CustomersView customers={(customers as Customer[]) || []} />;
}
