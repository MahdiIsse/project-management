"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTagToTask,
  removeTagFromTask,
} from "@/features/task-management/actions";
import { useSearchParams } from "next/navigation";
import { Task, Tag } from "../../types";

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
            old?.map((task) => {
              if (task.id === taskId) {
                const tagExists = task.tags.some((t) => t.id === tagId);
                if (tagExists) {
                  return task;
                }
                return { ...task, tags: [...task.tags, tagToAdd] };
              }
              return task;
            }) || []
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
            old?.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  tags: task.tags.filter((t) => t.id !== tagId),
                };
              }
              return task;
            }) || []
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
  });
}