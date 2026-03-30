import type { Task } from "@/types";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  return (
    <Card
      className="group hover:shadow-md transition-shadow mb-4"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CardTitle className="truncate text-lg font-mono">
              {task.title}
            </CardTitle>
          </div>
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
