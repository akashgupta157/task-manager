"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/contexts/userContext";

export default function ProjectsNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  useEffect(() => {
    if (user && user.role !== "admin") {
      redirect("/projects");
    }
  }, [user]);

  return children;
}
