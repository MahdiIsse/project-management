import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mapTaskFromDotNet,
  Assignee,
  Task,
  PreviousDataContext,
  restoreCache,
  updateTaskInCache,
} from '@/features/project-management';
import { apiClient } from '@/shared';

export function useAddAssigneeToTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    { taskId: string; assigneeId: string },
    PreviousDataContext
  >({
    mutationFn: async ({
      taskId,
      assigneeId,
    }: {
      taskId: string;
      assigneeId: string;
    }) => {
      const updatedTask = await apiClient.addAssigneeToTask(
        workspaceId,
        taskId,
        assigneeId
      );
      return mapTaskFromDotNet(updatedTask);
    },

    onMutate: async ({ taskId, assigneeId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', workspaceId] });

      const allAssignees = queryClient.getQueryData<Assignee[]>(['assignees']);
      const assigneeToAdd = allAssignees?.find((a) => a.id === assigneeId);

      if (!assigneeToAdd) {
        throw new Error(`Assignee not found with ID: ${assigneeId}`);
      }

      return updateTaskInCache(queryClient, workspaceId, taskId, (task) => ({
        ...task,
        assignees: task.assignees.some((a) => a.id === assigneeId)
          ? task.assignees
          : [...task.assignees, assigneeToAdd],
      }));
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        restoreCache(queryClient, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
    },
  });
}
