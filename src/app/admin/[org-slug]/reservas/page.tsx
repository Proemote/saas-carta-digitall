import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import ReservationsView from "@/components/admin/ReservationsView";

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

  return <ReservationsView />;
}
