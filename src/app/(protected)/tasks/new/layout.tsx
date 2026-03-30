"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/contexts/userContext";

export default function TasksNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "manager") {
      redirect("/tasks");
    }
  }, [user]);

  return children;
}
