"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Badge,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared";
import { cn } from "@/shared";
import { Check, Plus, Palette } from "lucide-react";
import { COLORS, ColorInternalName, getTagColorByName } from "@/shared";
import { useCreateTag } from "@/features/task-management";
import type { Tag } from "@/features/task-management";

const tagCreateSchema = z.object({
  colorSelection: z.string().min(1, "Selecteer een kleur"),
});

type TagCreateValues = z.infer<typeof tagCreateSchema>;

interface TagCreateFormProps {
  onSuccess?: (newTag: Tag) => void;
  initialName: string;
  className?: string;
}

export function TagCreateForm({
  onSuccess,
  initialName,
  className,
}: TagCreateFormProps) {
  const [selectedColor, setSelectedColor] = useState<ColorInternalName | "">(
    ""
  );
  const { mutate: createTag, isPending } = useCreateTag();

  const form = useForm<TagCreateValues>({
    resolver: zodResolver(tagCreateSchema),
    defaultValues: {
      colorSelection: "",
    },
  });

  const selectedColorData = selectedColor
    ? getTagColorByName(selectedColor)
    : null;

  const onSubmit = (data: TagCreateValues) => {
    const colorData = getTagColorByName(
      data.colorSelection as ColorInternalName
    );
    if (!colorData) return;

    const tagData = {
      name: initialName, // ✅ Gebruik de voorgedefinieerde naam
      colorName: colorData.name,
      colorText: colorData.colorText,
      colorBg: colorData.colorBg,
    };

    createTag(tagData, {
      onSuccess: (newTag) => {
        form.reset();
        setSelectedColor("");
        onSuccess?.(newTag);
      },
    });
  };

  return (
    <div className={cn("border-t bg-muted/30", className)}>
      <div className="p-4 space-y-4">
        {/* ✅ Simplified header met naam */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">Kleur kiezen voor</h4>
          </div>

          {/* ✅ Toon de naam als badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {initialName}
            </Badge>
            <span className="text-xs text-muted-foreground">
              → Kies een kleur
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ✅ Alleen Color Picker - geen naam input */}
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
                      {COLORS.map((color) => (
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
                          title={color.name}
                          aria-label={`Selecteer kleur ${color.name}`}
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

            {/* ✅ Live Preview */}
            {selectedColorData && (
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
                    {initialName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedColorData.name}
                  </span>
                </div>
              </div>
            )}

            {/* ✅ Submit Button */}
            <Button
              type="submit"
              size="sm"
              className="w-full h-8"
              disabled={isPending || !selectedColor}
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
