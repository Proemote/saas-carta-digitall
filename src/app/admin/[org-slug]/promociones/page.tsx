import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import PromotionsManager from "@/components/admin/PromotionsManager";

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

  return <PromotionsManager />;
}
