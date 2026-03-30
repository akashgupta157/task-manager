"use client";

import { useRouter } from "next/navigation";
import { TaskForm } from "@/components/taskForm";
import { useUser } from "@/contexts/userContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewTaskPage() {
  const router = useRouter();
  const { user } = useUser();

  const canCreate = user?.role === "admin" || user?.role === "manager";

  if (!canCreate) {
    router.back();
    return null;
  }

  return (
    <div className="p-6 mx-auto">
      <Card style={{ width: "500px" }}>
        <CardHeader>
          <CardTitle className="font-mono">New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onSuccess={() => router.push("/tasks")} />
        </CardContent>
      </Card>
    </div>
  );
}
