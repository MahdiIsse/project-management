'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/shared';
import { mapTaskFromDotNet, Task } from '@/features/project-management';

export function useRemoveTagFromTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspace') ?? '';

  return useMutation({
    mutationFn: async ({
      taskId,
      tagId,
    }: {
      taskId: string;
      tagId: string;
    }) => {
      const updatedTask = await apiClient.removeTagFromTask(
        workspaceId,
        taskId,
        tagId
      );
      return mapTaskFromDotNet(updatedTask);
    },

    onMutate: async ({ taskId, tagId }) => {
      const queryKey = ['tasks', workspaceId];
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
      const queryKey = ['tasks', workspaceId];
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
    },
  });
}
