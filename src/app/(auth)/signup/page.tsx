"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import client from "@/lib/supabase/client";
import { toast } from "sonner";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Enter a valid email.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { error } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.username,
        },
      },
    });
    if (error) {
      toast.error(error.message || "Something went wrong");
      return;
    }

    toast.success("Account created successfully");
  };

  return (
    <div className="font-mono flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-mono">
              Create your account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    leftIcon={<UserIcon className="h-4 w-4" />}
                    id="name"
                    placeholder="John Doe"
                    {...form.register("username")}
                  />
                  {form.formState.errors.username && (
                    <FieldDescription className="text-destructive">
                      {form.formState.errors.username.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    leftIcon={<MailIcon className="h-4 w-4" />}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <FieldDescription className="text-destructive">
                      {form.formState.errors.email.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    leftIcon={<LockIcon className="h-4 w-4" />}
                    id="password"
                    type="password"
                    placeholder="********"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <FieldDescription className="text-destructive">
                      {form.formState.errors.password.message}
                    </FieldDescription>
                  )}
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>

                <Field>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>

                  <FieldDescription className="text-center">
                    Already have an account? <Link href="/login">Login</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
