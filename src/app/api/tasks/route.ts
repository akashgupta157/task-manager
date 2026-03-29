import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/getUserRole";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = await getUserRole(supabase, user.id);

  if (!userRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("tasks")
    .select(
      `*,
      assignedTo:profiles(id, username, role),
      project:projects(id, title)
    `,
    )
    .order("created_at", { ascending: false });

  if (userRole.role === "employee") {
    query = query.eq("assigned_to", user.id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = await getUserRole(supabase, user.id);

  if (!userRole || userRole.role === "employee") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const { data, error } = await supabase.from("tasks").insert({
    title: body.title,
    description: body.description,
    status: body.status || "pending",
    project_id: body.project_id,
    assigned_to: body.assigned_to,
    created_by: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
