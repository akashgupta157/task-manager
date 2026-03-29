"use client";

import { Task } from "@/types";
import { useState } from "react";
import { TaskCard } from "./taskCard";
import { TaskModal } from "./modals/taskModal";
import { Circle, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TaskBoard({
  tasks,
  refetch,
}: {
  tasks: Task[];
  refetch: () => void;
}) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const statusList = [
    {
      label: "Todo",
      icon: Circle,
      color: "text-muted-foreground",
      name: "todo",
    },
    {
      label: "In Progress",
      icon: Clock,
      color: "text-blue-500",
      name: "in_progress",
    },
    {
      label: "Done",
      icon: CheckCircle2,
      color: "text-green-500",
      name: "done",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {statusList.map((status) => (
        <Card key={status.label} className="flex flex-col h-fit">
          <CardHeader className="shrink-0">
            <CardTitle className="flex items-center gap-2">
              <status.icon className={status.color} /> {status.label}
            </CardTitle>
          </CardHeader>

          {tasks.filter((task) => task.status === status.name).length > 0 ? (
            <CardContent className="space-y-4">
              {tasks
                .filter((task) => task.status === status.name)
                .map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={setEditingTask} />
                ))}
            </CardContent>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No tasks found</p>
            </CardContent>
          )}
        </Card>
      ))}

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
