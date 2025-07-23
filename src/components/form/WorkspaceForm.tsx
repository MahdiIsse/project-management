"use client";

import { useState } from "react";
import {
  useCreateWorkspace,
  useUpdateWorkspace,
} from "@/hooks/workspace/useWorkspaces";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/colors";
import { Workspace } from "@/types";

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
            color: workspaceToEdit.color || COLORS[0].colorBg,
          }
        : {
            title: "",
            description: "",
            color: COLORS[0].colorBg,
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
            const selectedColor = COLORS.find(
              (color) => color.colorBg === field.value
            );

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
                              "w-4 h-4 rounded-full border-2",
                              selectedColor?.colorBg ||
                                "bg-gray-200 border-gray-300"
                            )}
                          />
                          <span className="font-normal">
                            {selectedColor?.name || "Selecteer een kleur"}
                          </span>
                        </div>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4">
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-center">
                        Kies een kleur voor je workspace
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {COLORS.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            className={cn(
                              "w-8 h-8 rounded-full border-2 border-transparent",
                              "hover:border-gray-400 transition-colors",
                              "focus:outline-none focus:border-gray-600",
                              color.colorBg,
                              field.value === color.colorBg &&
                                "ring-2 ring-offset-2 ring-gray-400"
                            )}
                            onClick={() => {
                              field.onChange(color.colorBg);
                              setIsColorPickerOpen(false);
                            }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        Klik op een kleur om deze te selecteren
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
