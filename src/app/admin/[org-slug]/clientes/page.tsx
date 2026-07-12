import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import CustomersView from "@/components/admin/CustomersView";

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

  return <CustomersView />;
}
