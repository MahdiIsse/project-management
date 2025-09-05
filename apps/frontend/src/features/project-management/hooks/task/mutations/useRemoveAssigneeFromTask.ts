import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mapTaskFromDotNet,
  Task,
  restoreCache,
  updateTaskInCache,
  PreviousDataContext,
} from '@/features/project-management';
import { apiClient } from '@/shared';

export function useRemoveAssigneeFromTask(workspaceId: string) {
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
      const updatedTask = await apiClient.removeAssigneeFromTask(
        workspaceId,
        taskId,
        assigneeId
      );
      return mapTaskFromDotNet(updatedTask);
    },

    onMutate: async ({ taskId, assigneeId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', workspaceId] });

      return updateTaskInCache(queryClient, workspaceId, taskId, (task) => ({
        ...task,
        assignees: task.assignees.filter(
          (assignee) => assignee.id !== assigneeId
        ),
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
