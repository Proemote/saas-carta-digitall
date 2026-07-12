import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const supabase = await createClient();

    // Verify user has permission to edit this org
    const { data: userOrg } = await supabase
      .from("users_organizations")
      .select("role")
      .eq("org_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!userOrg || !["owner", "admin"].includes(userOrg.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update organization
    const { data, error } = await supabase
      .from("organizations")
      .update({
        name: body.name,
        primary_color: body.primary_color,
        secondary_color: body.secondary_color,
        logo_url: body.logo_url,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}
