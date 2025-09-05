import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  convertPriorityToBackend,
  CreateTaskInput,
  Task,
  mapTaskFromDotNet,
} from '@/features/project-management';
import { apiClient, CreateProjectTaskDto } from '@/shared';
import {
  addTaskToCache,
  updateTaskInCache,
  restoreCache,
  PreviousDataContext,
} from '../utils/cacheHelpers';

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput, PreviousDataContext>({
    mutationFn: async ({ columnId, data }: CreateTaskInput) => {
      const apiData: CreateProjectTaskDto = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: convertPriorityToBackend(data.priority),
      };

      const dotnetTask = await apiClient.createTask(
        workspaceId,
        columnId,
        apiData
      );
      let finalTask = mapTaskFromDotNet(dotnetTask);

      if (data.assigneeIds && data.assigneeIds.length > 0) {
        for (const assigneeId of data.assigneeIds) {
          const updatedTask = await apiClient.addAssigneeToTask(
            workspaceId,
            finalTask.id,
            assigneeId
          );
          finalTask = mapTaskFromDotNet(updatedTask);
        }
      }
      if (data.tagIds && data.tagIds.length > 0) {
        for (const tagId of data.tagIds) {
          const updatedTask = await apiClient.addTagToTask(
            workspaceId,
            finalTask.id,
            tagId
          );
          finalTask = mapTaskFromDotNet(updatedTask);
        }
      }
      return finalTask;
    },

    onMutate: async ({ columnId, data }) => {
      const queryKey = ['tasks', workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority,
        position: 99,
        columnId,
        workspaceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignees: [],
        tags: [],
      };

      return addTaskToCache(queryClient, workspaceId, optimisticTask);
    },

    onSuccess: (realTask) => {
      updateTaskInCache(queryClient, workspaceId, realTask.id, () => realTask);
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
