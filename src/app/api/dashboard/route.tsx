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

  const [users, projects, tasks] = await Promise.all([
    userRole?.role === "admin"
      ? supabase.from("profiles").select("*", { count: "exact", head: true })
      : null,
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
  ]);

  return NextResponse.json({ users, projects, tasks });
}
