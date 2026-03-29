"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import TaskBoard from "@/components/taskBoard";
import { useQuery } from "@tanstack/react-query";
import { ListTodo, Loader2 } from "lucide-react";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: projectDetails,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["project-details", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/project/${id}/task`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Project - {projectDetails?.project?.title}
      </h1>
      <p className="text-muted-foreground">
        {projectDetails?.project?.description}
      </p>

      <div>
        {projectDetails?.tasks.length > 0 ? (
          <TaskBoard tasks={projectDetails?.tasks} refetch={refetch} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <ListTodo className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No tasks yet</h3>
          </div>
        )}
      </div>
    </div>
  );
}
