"use client";

import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import type { Project } from "@/types";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/userContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderIcon, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field";

interface ProjectModalProps {
  project?: Project | null;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProjectModal({
  project,
  trigger,
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: ProjectModalProps) {
  const { user } = useUser();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const isEdit = !!project;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      if (!project) return;
      await axios.put(`/api/project/${project.id}`, data);
      toast.success("Project updated successfully");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        isEdit ? "Failed to update project" : "Failed to create project",
      );
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    try {
      await axios.delete(`/api/project/${project.id}`);
      toast.success("Project deleted successfully");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md font-mono">
        <DialogHeader>
          <DialogTitle className="font-mono">
            {isEdit && "Edit Project"}
          </DialogTitle>
          <DialogDescription>
            {isEdit && "Update your project details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Enter project title"
                  type="text"
                  id="title"
                  {...form.register("title")}
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
                  placeholder="Enter project description (optional)"
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <FieldDescription className="text-destructive">
                    {form.formState.errors.description.message}
                  </FieldDescription>
                )}
              </FieldContent>
            </Field>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={form.formState.isSubmitting}
                className="sm:order-1 sm:mr-auto"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                isEdit && (
                  <>
                    <Pencil className="size-4" />
                    Save Changes
                  </>
                )
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
