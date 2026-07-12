import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";
import ChatbotManager from "@/components/admin/ChatbotManager";

interface PageProps {
  params: Promise<{
    "org-slug": string;
  }>;
}

export default async function ChatbotPage({ params }: PageProps) {
  const { "org-slug": orgSlug } = await params;
  const organizations = await getUserOrganizations();
  const currentOrg = organizations.find((org) => org.slug === orgSlug);

  if (!currentOrg) {
    redirect("/login");
  }

  return <ChatbotManager />;
}
