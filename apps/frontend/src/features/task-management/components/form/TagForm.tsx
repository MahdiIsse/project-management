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
} from "../../../../shared";
import { cn } from "../../../../shared";
import { Plus } from "lucide-react";
import {
  TAG_COLORS,
  getTagColorByName,
  getTagColorByHex,
  getHexByTagColorName,
} from "../../utils/tagColors";
import { useCreateTag, useUpdateTag } from "../..";
import {
  tagSchema,
  TagSchemaValues,
} from "../../schemas/tags";
import type { Tag } from "../..";

interface TagFormProps {
  onSuccess?: (newTag: Tag) => void;
  initialName?: string;
  tagToEdit?: Tag;
}

export function TagForm({
  onSuccess,
  initialName = "",
  tagToEdit,
}: TagFormProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const { mutate: createTag, isPending: isCreating } = useCreateTag();
  const { mutate: updateTag, isPending: isUpdating } = useUpdateTag();

  const isEditMode = Boolean(tagToEdit);
  const isPending = isCreating || isUpdating;

  const getInitialColorName = (): string => {
    if (tagToEdit?.color) {
      const colorTheme = getTagColorByHex(tagToEdit.color);
      return colorTheme.name;
    }
    return TAG_COLORS[0].name;
  };

  const form = useForm<TagSchemaValues>({
    resolver: zodResolver(tagSchema),
    defaultValues:
      isEditMode && tagToEdit
        ? {
            name: tagToEdit.name,
            color: getInitialColorName(),
          }
        : {
            name: initialName,
            color: TAG_COLORS[0].name,
          },
  });

  const selectedColorName = form.watch("color");
  const tagName = form.watch("name");
  const selectedColorData = getTagColorByName(selectedColorName);

  const onSubmit = (data: TagSchemaValues) => {
    const dataToSend = {
      name: data.name,
      color: getHexByTagColorName(data.color),
    };

    if (isEditMode && tagToEdit) {
      updateTag(
        { tagId: tagToEdit.id, data: dataToSend },
        {
          onSuccess: (updatedTag) => {
            form.reset();
            onSuccess?.(updatedTag);
          },
        }
      );
    } else {
      createTag(dataToSend, {
        onSuccess: (newTag) => {
          form.reset({
            name: "",
            color: TAG_COLORS[0].name,
          });
          onSuccess?.(newTag);
        },
      });
    }
  };

  return (
    <div className="pt-4">
      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Voer tag naam in"
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
                          disabled={isPending}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full",
                                selectedColor?.pickerBg
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
                          {TAG_COLORS.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              className={cn(
                                "w-8 h-8 rounded-full border-2",
                                "hover:border-gray-400 transition-colors",
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
              <FormLabel>Preview</FormLabel>
              <Badge
                variant="secondary"
                className={cn(
                  selectedColorData.colorBg,
                  selectedColorData.colorText,
                  "transition-all"
                )}
              >
                {tagName}
              </Badge>
            </div>
          )}

          <Button
            type="button"
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isEditMode ? "Tag bijwerken" : "Tag toevoegen"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
