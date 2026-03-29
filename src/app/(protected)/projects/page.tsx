"use client";

import axios from "axios";
import { useState } from "react";
import type { Project } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/userContext";
import { FolderIcon, Loader2 } from "lucide-react";
import { ProjectCard } from "@/components/projectCard";
import { ProjectModal } from "@/components/modals/projectModal";

export default function ProjectsPage() {
  const { user } = useUser();
  const router = useRouter();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const {
    data: projects = [],
    isLoading,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/project");
      return data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>

        {user?.role === "admin" && (
          <Button onClick={() => router.push("/projects/new")}>
            <FolderIcon className="size-4" />
            New Project
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <FolderIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditingProject}
            />
          ))}
        </div>
      )}

      {editingProject && (
        <ProjectModal
          project={editingProject}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingProject(null);
          }}
          onSuccess={() => {
            refetch();
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}
