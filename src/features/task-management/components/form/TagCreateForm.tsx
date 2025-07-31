"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Badge,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared";
import { cn } from "@/shared";
import { Plus } from "lucide-react";
import {
  TAG_COLORS,
  getTagColorByName,
} from "@/features/task-management/utils/tagColors";
import { useCreateTag, useUpdateTag } from "@/features/task-management";
import {
  tagSchema,
  TagSchemaValues,
} from "@/features/task-management/schemas/tags";
import type { Tag } from "@/features/task-management";

interface TagCreateFormProps {
  onSuccess?: (newTag: Tag) => void;
  initialName?: string;
  tagToEdit?: Tag;
}

export function TagCreateForm({
  onSuccess,
  initialName = "",
  tagToEdit,
}: TagCreateFormProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const { mutate: createTag, isPending: isCreating } = useCreateTag();
  const { mutate: updateTag, isPending: isUpdating } = useUpdateTag();

  const isEditMode = Boolean(tagToEdit);
  const isPending = isCreating || isUpdating;

  const form = useForm<TagSchemaValues>({
    resolver: zodResolver(tagSchema),
    defaultValues:
      isEditMode && tagToEdit
        ? {
            name: tagToEdit.name,
            colorName: tagToEdit.colorName,
          }
        : {
            name: initialName,
            colorName: TAG_COLORS[0].name,
          },
  });

  const selectedColorName = form.watch("colorName");
  const tagName = form.watch("name");
  const selectedColorData = getTagColorByName(selectedColorName);

  const onSubmit = (data: TagSchemaValues) => {
    if (isEditMode && tagToEdit) {
      updateTag(
        { tagId: tagToEdit.id, data },
        {
          onSuccess: (updatedTag) => {
            form.reset();
            onSuccess?.(updatedTag);
          },
        }
      );
    }
    createTag(data, {
      onSuccess: (newTag) => {
        form.reset({
          name: "",
          colorName: TAG_COLORS[0].name,
        });
        onSuccess?.(newTag);
      },
    });
  };

  return (
    <div className="pt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag naam</FormLabel>
                <FormControl>
                  <Input placeholder="Bijv. Bug, Feature, Urgent" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="colorName"
            render={({ field }) => {
              const selectedColor = TAG_COLORS.find(
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
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border",
                                selectedColor?.pickerBg // 👈 Gebruik heldere kleur in plaats van colorBg
                              )}
                            />
                            <span className="font-normal">
                              {selectedColor?.name || "Selecteer een kleur"}
                            </span>
                          </div>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0">
                      <div className="bg-background border rounded-md shadow-lg">
                        <div className="p-4 space-y-3">
                          <div className="text-sm font-medium text-center text-foreground">
                            Kies een kleur voor je tag
                          </div>
                          <div className="grid grid-cols-5 gap-3">
                            {TAG_COLORS.map((color) => (
                              <button
                                key={color.name}
                                type="button"
                                className={cn(
                                  "w-8 h-8 rounded-full border-2",
                                  "hover:border-primary hover:scale-110 transition-all duration-200",
                                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                  color.pickerBg,
                                  field.value === color.name
                                    ? "border-primary ring-2 ring-primary ring-offset-2"
                                    : "border-background/50"
                                )}
                                onClick={() => {
                                  field.onChange(color.name);
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
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {tagName && selectedColorData && (
            <div className="space-y-2">
              <FormLabel>Voorbeeld</FormLabel>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    selectedColorData.colorBg,
                    selectedColorData.colorText,
                    "transition-all"
                  )}
                >
                  {tagName}
                </Badge>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            <Plus className="h-4 w-4 mr-2" />
            {isPending ? "Tag aanmaken..." : "Tag aanmaken"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
