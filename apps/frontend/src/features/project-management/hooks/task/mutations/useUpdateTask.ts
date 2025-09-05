import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  convertPriorityToBackend,
  UpdateTaskInput,
  Task,
  mapTaskFromDotNet,
  updateTaskInCache,
  restoreCache,
  PreviousDataContext,
} from '@/features/project-management';
import { apiClient, UpdateProjectTaskDto } from '@/shared';

export function useUpdateTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskInput, PreviousDataContext>({
    mutationFn: async ({ taskId, data }: UpdateTaskInput) => {
      const currentTask = await apiClient.getTaskById(workspaceId, taskId);

      const updateData: UpdateProjectTaskDto = {
        title: data.title ?? currentTask.title,
        description: data.description ?? currentTask.description,
        dueDate: data.dueDate ?? currentTask.dueDate,
        priority: data.priority
          ? convertPriorityToBackend(data.priority)
          : currentTask.priority,
        columnId: data.columnId ?? currentTask.columnId,
        position: data.position ?? currentTask.position,
      };

      const updatedTask = await apiClient.updateTask(
        workspaceId,
        taskId,
        updateData
      );
      return mapTaskFromDotNet(updatedTask);
    },

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', workspaceId] });

      return updateTaskInCache(queryClient, workspaceId, taskId, (task) => ({
        ...task,
        ...data,
        updatedAt: new Date().toISOString(),
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
