"use client";

import axios from "axios";
import type { Task } from "@/types";
import { Loader2 } from "lucide-react";
import TaskBoard from "@/components/taskBoard";
import { useQuery } from "@tanstack/react-query";
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
      ) : (
        projects.map((project) => {
          const projectTasks = tasks.filter(
            (task) => task.project_id === project.id,
          );
          if (projectTasks.length === 0) return null;
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
