"use client";

import { useCreateWorkspace, useUpdateWorkspace } from "@/hooks/useWorkspaces";

import { workspaceSchema, WorkspaceSchemaValues } from "@/schemas/workspace";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import type { Tables } from "@/types/database.types";

interface WorkspaceFormProps {
  workspaceToEdit?: Tables<"workspaces">;
}

export function WorkspaceForm({ workspaceToEdit }: WorkspaceFormProps) {
  const isEditMode = Boolean(workspaceToEdit);
  const { mutate: createWorkspace } = useCreateWorkspace();
  const { mutate: updateWorkspace } = useUpdateWorkspace();

  const form = useForm<WorkspaceSchemaValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues:
      isEditMode && workspaceToEdit
        ? {
            title: workspaceToEdit.title,
            description: workspaceToEdit.description || "",
            color: workspaceToEdit.color || "",
          }
        : {
            title: "",
            description: "",
            color: "",
          },
  });

  const handleSubmit = (data: WorkspaceSchemaValues) => {
    if (isEditMode) {
      if (!workspaceToEdit) return;

      updateWorkspace({ id: workspaceToEdit.id, data });
    } else {
      createWorkspace(data, {
        onSuccess: () => {
          form.reset();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vul hier de titel van de workspace in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschrijving</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Vul hier de beschrijving van de workspace in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{isEditMode ? "Pas aan" : "Maak aan"}</Button>
      </form>
    </Form>
  );
}
