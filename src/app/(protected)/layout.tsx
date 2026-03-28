import { Providers } from "./providers";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/contexts/userContext";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <Providers>
      <UserProvider>
        <div className="flex min-h-screen flex-col font-mono">
          <Header />
          {children}
        </div>
      </UserProvider>
    </Providers>
  );
}
