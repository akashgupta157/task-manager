import { Button } from "./ui/button";
import type { Task } from "@/types";
import { MoreVertical } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "./ui/card";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CardTitle className="truncate text-lg font-mono">
              {task.title}
            </CardTitle>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onEdit(task)}
          >
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">
          {task.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="py-2 text-sm text-muted-foreground">
        <p>Assigned To: {task.assignedTo?.username}</p>
      </CardFooter>
    </Card>
  );
}
