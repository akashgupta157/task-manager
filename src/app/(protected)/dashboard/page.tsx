"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/userContext";
import { Users, FolderKanban, CheckSquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  users: { count: number } | null;
  projects: { count: number } | null;
  tasks: { count: number } | null;
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard");
      return data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard, {user?.username}!
        </p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {user?.role === "admin" && (
            <Card
              onClick={() => router.push("/users")}
              className="cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats?.users?.count ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>
          )}

          <Card
            onClick={() => router.push("/projects")}
            className="cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.projects?.count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => router.push("/tasks")}
            className="cursor-pointer"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.tasks?.count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">All tasks</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
