"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/utils/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { signUpSchema, SignUpSchemaValues } from "../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
} from "@/shared/components/ui/form";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared";
import { useSignup } from "../hooks/useAuth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { mutate: signup, isPending, isError, error } = useSignup();

  const form = useForm<SignUpSchemaValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatarFile: undefined,
    },
  });

  const onSubmit = (data: SignUpSchemaValues) => {
    signup(data);
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Maak een account aan</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Vul je gegevens in om een nieuw account aan te maken.
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="avatarFile"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-2">
                  <FormLabel
                    htmlFor="avatar-upload"
                    className="relative cursor-pointer group"
                  >
                    <Avatar className="h-24 w-24 border-2 border-primary group-hover:ring-4 group-hover:ring-primary/30 transition-all duration-200">
                      <AvatarImage
                        src={avatarPreview ?? ""}
                        alt="User avatar"
                      />
                      <AvatarFallback className="text-4xl">
                        {form.getValues("fullName")?.charAt(0).toUpperCase() ||
                          ""}
                      </AvatarFallback>
                    </Avatar>
                  </FormLabel>
                  <span className="text-xs text-muted-foreground mt-2">
                    Klik op de avatar om een profielfoto te kiezen
                  </span>
                </div>
                <FormControl>
                  <Input
                    id="avatar-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarPreview(URL.createObjectURL(file));
                        field.onChange(file);
                      } else {
                        setAvatarPreview(null);
                        field.onChange(undefined);
                      }
                    }}
                    name={field.name}
                    disabled={field.disabled}
                    ref={field.ref}
                    onBlur={field.onBlur}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Bijv. Jan Janssen"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wachtwoord</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bevestig wachtwoord</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {isError && <div className="text-red-700">{error.message}</div>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Account aanmaken..." : "Account aanmaken"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Heb je al een account?
          <Link href="/login" className="underline underline-offset-4 ml-1">
            Log in
          </Link>
        </div>
      </form>
    </Form>
  );
}
