import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminRedirectPage() {
  const organizations = await getUserOrganizations();

  if (organizations.length === 0) {
    redirect("/login");
  }

  redirect(`/admin/${organizations[0].slug}`);
}
