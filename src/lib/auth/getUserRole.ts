export async function getUserRole(
  supabase: any,
  userId: string,
): Promise<{ role: "admin" | "manager" | "employee" } | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return data;
}
