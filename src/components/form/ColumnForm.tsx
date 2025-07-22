"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { columnSchema, ColumnSchemaValues } from "@/schemas/columns";
import { useCreateColumn, useUpdateColumn } from "@/hooks/useColumns";
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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Column } from "@/types";
import { COLORS } from "@/lib/colors";

interface ColumnFormProps {
  workspaceId: string;
  columnToEdit?: Column;
  closeDialog: () => void;
}

export function ColumnForm({
  workspaceId,
  columnToEdit,
  closeDialog,
}: ColumnFormProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const isEditMode = Boolean(columnToEdit);

  const { mutate: createColumn } = useCreateColumn();
  const { mutate: updateColumn } = useUpdateColumn();

  const form = useForm<ColumnSchemaValues>({
    resolver: zodResolver(columnSchema),
    defaultValues: isEditMode
      ? {
          title: columnToEdit?.title,
          border: columnToEdit?.border || COLORS[0].border,
        }
      : {
          title: "",
          border: COLORS[0].border, // Default naar eerste kleur
        },
  });

  const onSubmit = (data: ColumnSchemaValues) => {
    if (isEditMode) {
      if (!columnToEdit) return;
      updateColumn(
        {
          id: columnToEdit.id,
          data,
        },
        {
          onSuccess: () => closeDialog(),
        }
      );
    } else {
      createColumn(
        { id: workspaceId, data },
        {
          onSuccess: () => {
            form.reset();
            closeDialog();
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kolom naam</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vul hier de naam van de kolom in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="border"
          render={({ field }) => {
            const selectedColor = COLORS.find(
              (color) => color.border === field.value
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
                        Kies een kleur voor je kolom
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
                              field.value === color.border &&
                                "ring-2 ring-offset-2 ring-gray-400"
                            )}
                            onClick={() => {
                              field.onChange(color.border);
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
          <Button type="button" variant="outline" onClick={closeDialog}>
            Annuleren
          </Button>
        </div>
      </form>
    </Form>
  );
}
