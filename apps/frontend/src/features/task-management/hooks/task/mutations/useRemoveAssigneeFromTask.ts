import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mapTaskFromDotNet } from "../../../mappings";
import { apiClient } from "../../../../../shared/lib/api/client";

export function useRemoveAssigneeFromTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) => {
      const updatedTask = await apiClient.removeAssigneeFromTask(workspaceId, taskId, assigneeId);
      return mapTaskFromDotNet(updatedTask);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}