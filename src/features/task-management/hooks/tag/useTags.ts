"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, createTag, updateTag, deleteTag } from "@/features/task-management";
import { Tag } from "../../types";
import { TagSchemaValues } from "@/features/task-management";

export function useTags() {
  return useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: getTags,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagSchemaValues) => createTag(data),
    onMutate: async (data) => {
      const queryKey = ["tags"];
      await queryClient.cancelQueries({ queryKey });

      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      const optimisticTag: Tag = {
        id: `optimistic-${Date.now()}`,
        name: data.name,
        colorName: data.colorName,
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      tagId,
    }: {
      data: TagSchemaValues;
      tagId: string;
    }) => updateTag(data, tagId),
    onMutate: async ({ data, tagId }) => {
      const queryKey = ["tags"];
      await queryClient.cancelQueries({ queryKey });

      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      queryClient.setQueryData<Tag[]>(queryKey, (old) =>
        old?.map((tag) => (tag.id === tagId ? { ...tag, ...data } : tag))
      );

      return { previousTags };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(["tags"], context.previousTags);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}