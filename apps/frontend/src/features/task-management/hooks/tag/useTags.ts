"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/lib/api/client";
import type { Tag } from "../../types/tag";
import type { CreateTagDto, UpdateTagDto } from "../../../../shared/types";
import { mapTagFromDotNet } from "../../mappings/tagMapping";
import { toast } from "sonner";

export function useTags() {
  return useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: async () => {
      const dotnetTags = await apiClient.getTags();
      
      return dotnetTags.map(mapTagFromDotNet);
    },
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagDto) => {
      const dotnetTag = await apiClient.createTag(data);
      return mapTagFromDotNet(dotnetTag);
    },
    onMutate: async (data) => {
      const queryKey = ["tags"];
      await queryClient.cancelQueries({ queryKey });

      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      const optimisticTag: Tag = {
        id: `optimistic-${Date.now()}`,
        name: data.name,
        color: data.color,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Tag[]>(queryKey, (old) => [
        ...(old || []),
        optimisticTag,
      ]);

      return { previousTags };
    },
    onError: (_err, _data, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(["tags"], context.previousTags);
      }
      toast.error("Kon de tag niet aanmaken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      data,
    }: {
      tagId: string;
      data: UpdateTagDto;
    }) => {
      const updatedTag = await apiClient.updateTag(tagId, data);
      return mapTagFromDotNet(updatedTag);
    },
    onMutate: async ({ tagId, data }) => {
      const queryKey = ["tags"];
      await queryClient.cancelQueries({ queryKey });

      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      queryClient.setQueryData<Tag[]>(queryKey, (old) =>
        old?.map((tag) =>
          tag.id === tagId ? { ...tag, name: data.name, colorName: data.color } : tag
        )
      );

      return { previousTags };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(["tags"], context.previousTags);
      }
      toast.error("Kon de tag niet bijwerken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      await apiClient.deleteTag(tagId);
      return tagId;
    },
    onMutate: async (tagId) => {
      const queryKey = ["tags"];
      await queryClient.cancelQueries({ queryKey });
      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      queryClient.setQueryData<Tag[]>(queryKey, (old) =>
        old?.filter((tag) => tag.id !== tagId)
      );

      return { previousTags };
    },
    onError: (_err, _tagId, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(["tags"], context.previousTags);
      }
      toast.error("Kon de tag niet verwijderen");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}