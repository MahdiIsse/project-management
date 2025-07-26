"use client";

import {
  useCreateAssignee,
  useUpdateAssignee,
} from "@/features/task-management/hooks/assignee/useAssignees";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assigneeSchema,
  AssigneeSchemaValues,
} from "@/features/task-management/schemas/assignees";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  Input,
  Button,
} from "@/shared";
import { Assignee } from "../../types";
import Image from "next/image";

interface AssigneeFormProps {
  assigneeToEdit?: Assignee;
  closeDialog: () => void;
  onAssigneeCreated?: (newAssignee: Assignee) => void;
}

export function AssigneeForm({
  assigneeToEdit,
  closeDialog,
  onAssigneeCreated,
}: AssigneeFormProps) {
  const isEditMode = Boolean(assigneeToEdit);
  const { mutate: createAssignee, isPending } = useCreateAssignee();
  const { mutate: updateAssignee } = useUpdateAssignee();

  const form = useForm({
    resolver: zodResolver(assigneeSchema),
    defaultValues:
      isEditMode && assigneeToEdit
        ? {
            name: assigneeToEdit.name,
            avatarFile: undefined,
          }
        : {
            name: "",
            avatarFile: undefined,
          },
  });

  const onSubmit = (data: AssigneeSchemaValues) => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (data.avatarFile) {
      formData.append("avatarFile", data.avatarFile);
    }

    if (isEditMode) {
      if (!assigneeToEdit) return;
      updateAssignee(
        { assigneeId: assigneeToEdit.id, formData },
        {
          onSuccess: () => {
            form.reset();
            closeDialog();
          },
        }
      );
    } else {
      createAssignee(
        { formData },
        {
          onSuccess: (newAssignee) => {
            form.reset();
            closeDialog();
            onAssigneeCreated?.(newAssignee);
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isEditMode && assigneeToEdit?.avatarUrl && (
          <div className="space-y-2">
            <FormLabel>Huidige Avatar</FormLabel>
            <Image
              src={assigneeToEdit.avatarUrl}
              alt={assigneeToEdit.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </div>
        )}

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

        <FormField
          control={form.control}
          name="avatarFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isEditMode ? "Opslaan" : "Maak aan"}
        </Button>
      </form>
    </Form>
  );
}
