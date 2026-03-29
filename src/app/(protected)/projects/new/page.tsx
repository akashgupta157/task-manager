"use client";

import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewProjectPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      await axios.post("/api/project", data);
      toast.success("Project created successfully");
      router.push("/projects");
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  return (
    <div className="p-6 mx-auto">
      <Card style={{ width: "500px" }}>
        <CardHeader>
          <CardTitle className="font-mono">New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Enter project title"
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
                  className="flex min-h-[80px] w-full rounded-lg border px-2.5 py-2"
                  placeholder="Enter project description (optional)"
                  {...form.register("description")}
                />
              </FieldContent>
            </Field>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? "Saving..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
