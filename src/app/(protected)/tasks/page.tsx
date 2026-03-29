"use client";

import axios from "axios";
import type { Task } from "@/types";
import TaskBoard from "@/components/taskBoard";
import { useQuery } from "@tanstack/react-query";
import { ListTodo, Loader2 } from "lucide-react";
import { TaskModal } from "@/components/modals/taskModal";

export default function TasksPage() {
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

  const projects = [
    ...new Map(tasks.map((task) => [task.project.id, task.project])).values(),
  ];

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
        projects.map((project) => {
          const projectTasks = tasks.filter(
            (task) => task.project_id === project.id,
          );
          return (
            <div key={project.id} className="space-y-4">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <TaskBoard tasks={projectTasks} refetch={refetch} />
            </div>
          );
        })
      )}
    </div>
  );
}
