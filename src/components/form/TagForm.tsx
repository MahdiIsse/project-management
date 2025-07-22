"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagSchema, TagSchemaValues } from "@/schemas/tags";
import { useCreateTag, useUpdateTag } from "@/hooks/useTags";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { Tables } from "@/types/database.types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface TagFormProps {
  tagToEdit?: Tables<"tags">;
}

export function TagForm({ tagToEdit }: TagFormProps) {
  const isEditMode = Boolean(tagToEdit);
  const { mutate: createTag } = useCreateTag();
  const { mutate: updateTag } = useUpdateTag();

  const form = useForm<TagSchemaValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: isEditMode
      ? {
          name: tagToEdit?.name,
          colorName: tagToEdit?.color_name,
          colorText: tagToEdit?.color_text,
          colorBg: tagToEdit?.color_bg,
        }
      : {
          name: "",
          colorName: "",
          colorText: "",
          colorBg: "",
        },
  });

  const onSubmit = (data: TagSchemaValues) => {
    if (isEditMode) {
      if (!tagToEdit) return;
      updateTag(
        { tagId: tagToEdit?.id, data },
        { onSuccess: () => form.reset() }
      );
    } else {
      createTag(data, { onSuccess: () => form.reset() });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Naam</FormLabel>
              <FormControl>
                <Input placeholder="Voer hier de tag naam in..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kleur</FormLabel>
              <FormControl>
                <Input placeholder="Voer hier de Kleur naam in..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kleur Tekst (tailwind)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Voer hier de Kleur tekst (tailwind) in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorBg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kleur achtergrond (tailwind)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Voer hier de Kleur achtergrond (tailwind) in..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{isEditMode ? "Opslaan" : "Maak aan"}</Button>
      </form>
    </Form>
  );
}
