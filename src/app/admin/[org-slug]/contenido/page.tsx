export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import ContentGenerator from "@/components/admin/ContentGenerator";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function ContentPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  return <ContentGenerator />;
}
