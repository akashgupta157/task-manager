"use client";

import { useUser } from "@/contexts/userContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  useEffect(() => {
    if (user && user.role !== "admin") {
      redirect("/dashboard");
    }
  }, [user]);

  return <>{children}</>;
}
