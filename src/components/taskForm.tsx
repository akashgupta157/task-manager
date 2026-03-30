"use client";

import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/userContext";
import type { Task, Project, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.enum(["todo", "in_progress", "done"]),
  project_id: z.string().min(1, { message: "Project is required" }),
  assigned_to: z.string().min(1, { message: "Assignee is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSuccess?: () => void;
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const { user } = useUser();
  const isEdit = !!task;

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/project");
      return data;
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: (["todo", "in_progress", "done"].includes(task?.status as string)
        ? task?.status
        : "todo") as FormValues["status"],
      project_id: task?.project_id || "",
      assigned_to: task?.assigned_to || "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      if (isEdit) {
        await axios.put(`/api/tasks/${task.id}`, data);
        toast.success("Task updated successfully");
      } else {
        await axios.post("/api/tasks", data);
        toast.success("Task created successfully");
      }
      onSuccess?.();
    } catch {
      toast.error(isEdit ? "Failed to update task" : "Failed to create task");
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await axios.delete(`/api/tasks/${task.id}`);
      toast.success("Task deleted successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const isCreator = task?.created_by === user?.id;
  const isAssignee = task?.assigned_to === user?.id;

  const canEdit =
    !isEdit ||
    user?.role === "admin" ||
    (user?.role === "manager" && isCreator);

  const canEditStatus =
    user?.role === "admin" ||
    (user?.role === "manager" && (isCreator || isAssignee)) ||
    (user?.role === "employee" && isAssignee);

  const selectedUser = users.find((u) => u.id === form.watch("assigned_to"));

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Title</FieldLabel>
        <FieldContent>
          <Input
            placeholder="Enter task title"
            type="text"
            id="title"
            {...form.register("title")}
            disabled={!canEdit}
          />
          {form.formState.errors.title && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.title.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <FieldContent>
          <textarea
            className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm resize-none"
            placeholder="Enter task description"
            {...form.register("description")}
            disabled={!canEdit}
          />
          {form.formState.errors.description && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.description.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Project</FieldLabel>
        <FieldContent>
          <Select
            value={form.watch("project_id")}
            onValueChange={(value) =>
              form.setValue("project_id", value, { shouldValidate: true })
            }
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div>{project.title}</div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.formState.errors.project_id && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.project_id.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>

      {isEdit && (
        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <Select
              value={form.watch("status")}
              onValueChange={(value) =>
                form.setValue("status", value as FormValues["status"])
              }
              disabled={!canEditStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="todo">
                    <div>Todo</div>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <div>In Progress</div>
                  </SelectItem>
                  <SelectItem value="done">
                    <div>Done</div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      )}

      <Field>
        <FieldLabel>Assignee To</FieldLabel>
        <FieldContent>
          <Select
            value={form.watch("assigned_to")}
            onValueChange={(value) =>
              form.setValue("assigned_to", value, { shouldValidate: true })
            }
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an assignee">
                {selectedUser?.username ?? "Select an assignee"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {users.map((userData) => (
                  <SelectItem
                    key={userData.id}
                    value={userData.id || ""}
                    className="font-mono px-2 py-1 w-full"
                  >
                    <div className="flex justify-between items-center w-full gap-2">
                      {userData.id === user?.id ? (
                        <span className="text-xs text-muted-foreground">
                          You
                        </span>
                      ) : (
                        <div className="flex flex-col">
                          <h1 className="text-sm font-medium">
                            {userData.username}
                          </h1>
                          <p className="text-xs text-muted-foreground">
                            {userData.email}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground capitalize bg-muted rounded-md px-2 py-1">
                        {userData.role}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.formState.errors.assigned_to && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.assigned_to.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>

      <div className="flex items-center justify-between pt-2">
        {isEdit && canEdit && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={form.formState.isSubmitting}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        )}

        {(canEdit || canEditStatus) && (
          <Button
            type="submit"
            className="ml-auto"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? (
              <span className="animate-pulse">Saving...</span>
            ) : isEdit ? (
              <>
                <Pencil className="size-4" /> Save Changes
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" /> Create Task
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
