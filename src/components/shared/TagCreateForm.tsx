"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Check, Plus, Palette } from "lucide-react";
import {
  TAG_COLORS,
  TagColorInternalName,
  getTagColorByName,
} from "@/lib/tagColors";
import { useCreateTag } from "@/hooks/useTags";
import type { Tag } from "@/types";

const tagCreateSchema = z.object({
  name: z.string().min(2, "Tag naam moet minstens 2 karakters hebben"),
  colorSelection: z.string().min(1, "Selecteer een kleur"),
});

type TagCreateValues = z.infer<typeof tagCreateSchema>;

interface TagCreateFormProps {
  onSuccess?: (newTag: Tag) => void; // ✅ Nu met nieuwe tag data!
  initialName?: string;
  className?: string;
}

export function TagCreateForm({
  onSuccess,
  initialName = "",
  className,
}: TagCreateFormProps) {
  const [selectedColor, setSelectedColor] = useState<TagColorInternalName | "">(
    ""
  );
  const { mutate: createTag, isPending } = useCreateTag();

  const form = useForm<TagCreateValues>({
    resolver: zodResolver(tagCreateSchema),
    defaultValues: {
      name: initialName,
      colorSelection: "",
    },
  });

  const selectedColorData = selectedColor
    ? getTagColorByName(selectedColor)
    : null;
  const watchedName = form.watch("name");

  const onSubmit = (data: TagCreateValues) => {
    const colorData = getTagColorByName(
      data.colorSelection as TagColorInternalName
    );
    if (!colorData) return;

    const tagData = {
      name: data.name,
      colorName: colorData.colorName,
      colorText: colorData.colorText,
      colorBg: colorData.colorBg,
    };

    createTag(tagData, {
      onSuccess: (newTag) => {
        // ✅ Nu is newTag van type Tag!
        form.reset();
        setSelectedColor("");
        onSuccess?.(newTag); // ✅ Geen fallback nodig
      },
    });
  };

  return (
    <div className={cn("border-t bg-muted/30", className)}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Nieuwe tag maken</h4>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tag Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground">
                    Tag naam
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bijvoorbeeld: Bug, Feature, Design..."
                      className="h-8"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Picker Field */}
            <FormField
              control={form.control}
              name="colorSelection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground">
                    Kleur kiezen
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-5 gap-2">
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => {
                            setSelectedColor(color.name);
                            field.onChange(color.name);
                          }}
                          className={cn(
                            "relative h-8 w-full rounded-md border-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20",
                            color.colorBg,
                            selectedColor === color.name
                              ? "border-primary ring-2 ring-primary/20 scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          title={color.colorName}
                          aria-label={`Selecteer kleur ${color.colorName}`}
                        >
                          {selectedColor === color.name && (
                            <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-lg" />
                          )}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Live Preview */}
            {selectedColorData && watchedName.trim() && (
              <div className="space-y-2">
                <FormLabel className="text-xs font-medium text-muted-foreground">
                  Voorbeeld
                </FormLabel>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      selectedColorData.colorBg,
                      selectedColorData.colorText,
                      "transition-all"
                    )}
                  >
                    {watchedName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedColorData.colorName}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="sm"
              className="w-full h-8"
              disabled={isPending || !selectedColor || !watchedName.trim()}
            >
              <Plus className="h-3 w-3 mr-1" />
              {isPending ? "Tag maken..." : "Tag maken & toewijzen"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
