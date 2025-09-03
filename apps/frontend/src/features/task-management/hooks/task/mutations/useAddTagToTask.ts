"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { apiClient } from "../../../../../shared/lib/api/client";
import { mapTaskFromDotNet } from "../../../mappings";
import { Tag, Task } from "../../../types";
import { toast } from "sonner";

export function useAddTagToTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: async ({ taskId, tagId }: { taskId: string; tagId: string }) => {
      const updatedTask = await apiClient.addTagToTask(workspaceId, taskId, tagId);
      return mapTaskFromDotNet(updatedTask);
    },

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
      toast.error("Kon tag niet toevoegen aan taak");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}