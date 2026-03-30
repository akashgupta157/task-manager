"use client";

import axios from "axios";
import type { Task } from "@/types";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TaskForm } from "@/components/taskForm";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ["task", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tasks/${id}`);
      return data;
    },
  });

  return (
    <div className="p-6 mx-auto">
      <Card style={{ width: "500px" }}>
        <CardHeader>
          <CardTitle className="font-mono">Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : task ? (
            <TaskForm task={task} onSuccess={() => router.push("/tasks")} />
          ) : (
            <p className="text-muted-foreground">Task not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
