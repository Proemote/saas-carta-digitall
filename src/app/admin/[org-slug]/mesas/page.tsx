import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import TablesManager from "@/components/admin/TablesManager";

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

  return <TablesManager />;
}
