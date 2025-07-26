"use client";

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
  Input,
} from "@/shared";
import { cn } from "@/shared";
import { Check, Plus } from "lucide-react";
import { COLORS, ColorInternalName, getTagColorByName } from "@/shared";
import { useCreateTag } from "@/features/task-management";
import type { Tag } from "@/features/task-management";

const tagCreateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Naam moet minimaal 2 tekens lang zijn." }),
  colorSelection: z.string().min(1, "Selecteer een kleur"),
});

type TagCreateValues = z.infer<typeof tagCreateSchema>;

interface TagCreateFormProps {
  onSuccess?: (newTag: Tag) => void;
  initialName?: string;
}

export function TagCreateForm({
  onSuccess,
  initialName = "",
}: TagCreateFormProps) {
  const { mutate: createTag, isPending } = useCreateTag();

  const form = useForm<TagCreateValues>({
    resolver: zodResolver(tagCreateSchema),
    defaultValues: {
      name: initialName,
      colorSelection: "",
    },
  });

  const selectedColorName = form.watch("colorSelection");
  const tagName = form.watch("name");
  const selectedColorData = getTagColorByName(
    selectedColorName as ColorInternalName
  );

  const onSubmit = (data: TagCreateValues) => {
    const colorData = getTagColorByName(
      data.colorSelection as ColorInternalName
    );
    if (!colorData) return;

    const tagData = {
      name: data.name,
      colorName: colorData.name,
      colorText: colorData.colorText,
      colorBg: colorData.colorBg,
    };

    createTag(tagData, {
      onSuccess: (newTag) => {
        form.reset({ name: "", colorSelection: "" });
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
            name="colorSelection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kleur</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-5 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => field.onChange(color.name)}
                        className={cn(
                          "relative h-8 w-full rounded-md border-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20",
                          color.colorBg,
                          selectedColorName === color.name
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        title={color.name}
                        aria-label={`Selecteer kleur ${color.name}`}
                      >
                        {selectedColorName === color.name && (
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
