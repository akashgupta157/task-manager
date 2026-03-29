import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("title,description")
    .eq("id", id)
    .single();

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json({ project, tasks });
}
