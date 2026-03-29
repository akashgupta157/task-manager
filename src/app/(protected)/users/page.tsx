"use client";

import axios from "axios";
import type { User } from "@/types";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/userContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

export default function UsersPage() {
  const { user: currentUser } = useUser();

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data;
    },
  });

  const handleRoleChange = async (userId: string, role: string) => {
    await axios.put(`/api/users/${userId}`, { role });
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage roles and permissions</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="transition hover:shadow-md border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{user.username}</h2>

                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {user?.id === currentUser?.id || (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Change Role</p>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) =>
                        handleRoleChange(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>

                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectItem value="admin">
                            <div>Admin</div>
                          </SelectItem>
                          <SelectItem value="manager">
                            <div>Manager</div>
                          </SelectItem>
                          <SelectItem value="employee">
                            <div>Employee</div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
