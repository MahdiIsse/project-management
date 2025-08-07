"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTagToTask,
  removeTagFromTask,
} from "@/features/task-management/actions";
import { Tag, Task } from "../../types";
import { useSearchParams } from "next/navigation";

export function useAddTagToTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      addTagToTask(taskId, tagId),

    onMutate: async ({ taskId, tagId }) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);
      const allTags = queryClient.getQueryData<Tag[]>(["tags"]);
      const tagToAdd = allTags?.find((t) => t.id === tagId);

      if (previousTasks && tagToAdd) {
        queryClient.setQueryData<Task[]>(
          queryKey,
          (old) =>
            old?.map((task) =>
              task.id === taskId
                ? { ...task, tags: [...task.tags, tagToAdd] }
                : task
            ) || []
        );
      }
      return { previousTasks };
    },

    onError: (_err, _variables, context) => {
      const queryKey = ["tasks", workspaceId];
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },

    onSettled: () => {
      const queryKey = ["tasks", workspaceId];
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useRemoveTagFromTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      removeTagFromTask(taskId, tagId),

    onMutate: async ({ taskId, tagId }) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          queryKey,
          (old) =>
            old?.map((task) =>
              task.id === taskId
                ? { ...task, tags: task.tags.filter((t) => t.id !== tagId) }
                : task
            ) || []
        );
      }
      return { previousTasks };
    },

    onError: (_err, _variables, context) => {
      const queryKey = ["tasks", workspaceId];
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },

    onSettled: () => {
      const queryKey = ["tasks", workspaceId];
      queryClient.invalidateQueries({ queryKey });
    },
  });
}