"use client";

import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@/types";
import { useUser } from "@/contexts/userContext";
import { Home, LogOut, User } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function Header() {
  const { setUser, setLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery<UserType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get("/api/profile");
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setUser(profile);
      setLoading(false);
    }
  }, [profile, setUser]);

  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Home", href: "/" }];

    return segments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + segments.slice(0, index + 1).join("/"),
    }));
  };

  const handleLogout = async () => {
    const { error } = await supabaseBrowser().auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    queryClient.clear();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="font-mono flex h-14 items-center justify-between border-b px-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground"
        >
          <Home className="h-4 w-4" />
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {profile && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium capitalize">
                {profile.username}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                Role: {profile.role}
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
