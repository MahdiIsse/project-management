import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "../../../types";
import { apiClient } from "../../../../../shared/lib/api/client";
import { toast } from "sonner";

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await apiClient.deleteTask(workspaceId, taskId);
      return taskId;
    },
    onMutate: async (taskId) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old?.filter((task) => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", workspaceId], context.previousTasks);
      }
      toast.error("Kon de taak niet verwijderen");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}