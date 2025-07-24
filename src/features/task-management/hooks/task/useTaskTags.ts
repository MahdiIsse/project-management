import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskTags, addTagToTask, removeTagFromTask } from "@/features/task-management/actions";

export function useTaskTags(taskId: string) {
  return useQuery({
    queryKey: ["taskTags", taskId],
    queryFn: () => getTaskTags(taskId),
    enabled: !!taskId,
  });
}

export function useAddTagToTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      tagId,
    }: {
      taskId: string;
      tagId: string;
    }) => {
      return addTagToTask(taskId, tagId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taskTags", variables.taskId] });
    },
  });
}

export function useRemoveTagFromTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      tagId,
    }: {
      taskId: string;
      tagId: string;
    }) => {
      return removeTagFromTask(taskId, tagId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taskTags", variables.taskId] });
    },
  });
}