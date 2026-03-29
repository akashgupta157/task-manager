"use client";

import axios from "axios";
import { useState } from "react";
import type { Task } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ListTodo } from "lucide-react";
import { TaskCard } from "@/components/taskCard";
import { TaskModal } from "@/components/modals/taskModal";

export default function TasksPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tasks");
      return data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks</p>
        </div>
        <TaskModal onSuccess={() => refetch()} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <ListTodo className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No tasks yet</h3>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={setEditingTask} />
          ))}
        </div>
      )}

      {editingTask && (
        <TaskModal
          task={editingTask}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
          onSuccess={() => {
            refetch();
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
