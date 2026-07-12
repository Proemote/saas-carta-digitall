"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function updateOrgBranding(data: {
  primary_color: string;
  secondary_color: string;
  name: string;
  logo_url?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = await createClient();

  // Get current org (from session context)
  const { data: userOrgs } = await supabase
    .from("users_organizations")
    .select("org_id, role")
    .eq("user_id", user.id);

  if (!userOrgs || userOrgs.length === 0) {
    throw new Error("No organization found");
  }

  const orgId = userOrgs[0].org_id;
  const role = userOrgs[0].role;

  if (!["owner", "admin"].includes(role)) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      name: data.name,
      primary_color: data.primary_color,
      secondary_color: data.secondary_color,
      logo_url: data.logo_url || null,
    })
    .eq("id", orgId);

  if (error) throw error;
}
