"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/contexts/userContext";

export default function TasksNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "manager") {
      redirect("/tasks");
    }
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        Loading...
      </div>
    );

  return children;
}
