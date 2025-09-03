"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  columnSchema,
  ColumnSchemaValues,
} from "../../schemas/columns";
import {
  useCreateColumn,
  useUpdateColumn,
} from "../../hooks/column/useColumns";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "../../../../shared";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../shared";
import { Button, Input } from "../../../../shared";
import { cn } from "../../../../shared";
import { Column } from "../../types";
import { 
  COLUMN_COLORS, 
  getColumnColorByHex,        
  getHexByColumnColorName,    
} from "../../utils";

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

  const { mutate: createColumn, isPending: isCreatePending } =
    useCreateColumn(workspaceId);
  const { mutate: updateColumn, isPending: isUpdatePending } =
    useUpdateColumn(workspaceId);

  const isPending = isEditMode ? isUpdatePending : isCreatePending;

  const getInitialColorName = (): string => {
    if (columnToEdit?.color) {
      const colorTheme = getColumnColorByHex(columnToEdit.color);
      return colorTheme.name;
    }
    return "Grijs";
  };

  const form = useForm<ColumnSchemaValues>({
    resolver: zodResolver(columnSchema),
    defaultValues: isEditMode && columnToEdit
      ? {
          title: columnToEdit.title,
          color: getInitialColorName(), 
        }
      : {
          title: "",
          color: "Grijs", 
        },
  });

  const onSubmit = (data: ColumnSchemaValues) => {
    const dataToSend = {
      title: data.title,
      color: getHexByColumnColorName(data.color), 
    };

    if (isEditMode && columnToEdit) {
      updateColumn(
        {
          columnId: columnToEdit.id,
          data: {
            ...dataToSend,
            position: 0, 
          },
        },
        {
          onSuccess: () => closeDialog(),
        }
      );
    } else {
      createColumn(dataToSend, {
        onSuccess: () => {
          form.reset();
          closeDialog();
        }
      });
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
                  disabled={isPending}
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
            const selectedColor = COLUMN_COLORS.find(
              (color) => color.name === field.value 
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
                        disabled={isPending}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border",
                              selectedColor?.columnBg,
                              selectedColor?.border
                            )}
                          />
                          <span className="font-normal">
                            {selectedColor?.name || 'Selecteer kleur'}
                          </span>
                        </div>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-3">
                      <h4 className="font-medium leading-none">
                        Kies een kleur
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {COLUMN_COLORS.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            className={cn(
                              "w-8 h-8 rounded-full border-2",
                              "hover:border-gray-400 transition-colors",
                              "focus:outline-none focus:border-gray-600",
                              color.pickerBg,
                              field.value === color.name 
                                ? color.border
                                : "border-transparent"
                            )}
                            onClick={() => {
                              field.onChange(color.name); 
                              setIsColorPickerOpen(false);
                            }}
                            title={color.name}
                            disabled={isPending}
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
          <Button type="submit" disabled={isPending} className="flex-1">
            {isEditMode ? "Bijwerken" : "Aanmaken"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={isPending}
          >
            Annuleren
          </Button>
        </div>
      </form>
    </Form>
  );
}
