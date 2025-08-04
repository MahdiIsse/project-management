"use client";

import { cn } from "@/shared/lib/utils/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { loginSchema, LoginSchemaValues } from "@/features/auth/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/shared/components/ui/form";
import Link from "next/link";
import { useLogin } from "../hooks/useAuth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate: login, isPending, isError, error } = useLogin();

  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchemaValues) => {
    login(data);
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Log in op je account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Vul hieronder je e-mailadres in om in te loggen
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Wachtwoord</FormLabel>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isError && <div className="text-red-700">{error.message}</div>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Inloggen..." : "Inloggen"}
          </Button>
        </div>
        <div className="text-center text-sm ">
          <span className="mr-1">Heb je nog geen account?</span>
          <Link href="/signup" className="underline underline-offset-4">
            Registreer
          </Link>
        </div>
      </form>
    </Form>
  );
}
