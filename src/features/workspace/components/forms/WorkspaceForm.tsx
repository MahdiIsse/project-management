"use client";

import { useState } from "react";
import {
  useCreateWorkspace,
  useUpdateWorkspace,
} from "@/features/workspace/hooks";
import {
  workspaceSchema,
  WorkspaceSchemaValues,
} from "@/features/workspace/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/shared/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Input, Button, Textarea } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import {
  WORKSPACE_COLORS,
  getWorkspaceColorProps,
} from "@/features/workspace/utils/workspace-colors";
import { Workspace } from "@/features/workspace/types";

interface WorkspaceFormProps {
  workspaceToEdit?: Workspace;
  onClose: () => void;
}

export function WorkspaceForm({
  workspaceToEdit,
  onClose,
}: WorkspaceFormProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
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
            color: workspaceToEdit.color || "Slate",
          }
        : {
            title: "",
            description: "",
            color: "Slate",
          },
  });

  const handleSubmit = (data: WorkspaceSchemaValues) => {
    if (isEditMode) {
      if (!workspaceToEdit) return;

      updateWorkspace(
        { id: workspaceToEdit.id, data },
        { onSuccess: () => onClose() }
      );
    } else {
      createWorkspace(data, {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => {
            const selectedColor = getWorkspaceColorProps(field.value);

            return (
              <FormItem>
                <FormLabel>Kleur</FormLabel>
                <Popover
                  open={isColorPickerOpen}
                  onOpenChange={setIsColorPickerOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-10 px-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full",
                              selectedColor.bg
                            )}
                          />
                          <span className="font-normal">
                            {selectedColor.name}
                          </span>
                        </div>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-center">
                        Kies een thema voor je workspace
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {WORKSPACE_COLORS.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            className={cn(
                              "w-8 h-8 rounded-full border-2 transition-all",
                              "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
                              color.bg,
                              field.value === color.name
                                ? "border-white"
                                : "border-transparent"
                            )}
                            onClick={() => {
                              field.onChange(color.name);
                              setIsColorPickerOpen(false);
                            }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {isEditMode ? "Pas aan" : "Maak aan"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        </div>
      </form>
    </Form>
  );
}
