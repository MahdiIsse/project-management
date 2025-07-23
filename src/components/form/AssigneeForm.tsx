"use client";

import {
  useCreateAssignee,
  useUpdateAssignee,
} from "@/hooks/assignee/useAssignees";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assigneeSchema, AssigneeSchemaValues } from "@/schemas/assignees";
import type { Tables } from "@/types/database.types";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AssigneeFormProps {
  assigneeToEdit?: Tables<"assignees">;
}

export function AssigneeForm({ assigneeToEdit }: AssigneeFormProps) {
  const isEditMode = Boolean(assigneeToEdit);
  const { mutate: createAssignee } = useCreateAssignee();
  const { mutate: updateAssignee } = useUpdateAssignee();

  const form = useForm({
    resolver: zodResolver(assigneeSchema),
    defaultValues:
      isEditMode && assigneeToEdit
        ? {
            name: assigneeToEdit?.name,
          }
        : {
            name: "",
          },
  });

  const onSubmit = (data: AssigneeSchemaValues) => {
    if (isEditMode) {
      if (!assigneeToEdit) return;
      updateAssignee(
        { assigneeId: assigneeToEdit.id, data },
        { onSuccess: () => form.reset() }
      );
    } else {
      createAssignee({ data }, { onSuccess: () => form.reset() });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naam:</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vul hier de naam in van de verantwoordelijke"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{isEditMode ? "Opslaan" : "Maak aan"}</Button>
      </form>
    </Form>
  );
}
