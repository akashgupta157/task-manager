import { Button } from "./ui/button";
import type { Project } from "@/types";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { FolderIcon, MoreVertical } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";

export function ProjectCard({
  project,
  onEdit,
}: {
  project: Project;
  onEdit: (project: Project) => void;
}) {
  const { user } = useUser();
  const router = useRouter();
  return (
    <Card
      className="group hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2">
              <FolderIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="truncate text-lg">{project.title}</CardTitle>
          </div>
          {user?.role === "admin" && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onEdit(project)}
            >
              <MoreVertical className="size-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription className="line-clamp-2">
          {project.description || "No description provided"}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
