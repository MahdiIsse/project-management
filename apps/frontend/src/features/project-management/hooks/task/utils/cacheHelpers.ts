import { QueryClient } from '@tanstack/react-query';
import { Task } from '@/features';

export type PreviousDataContext = {
  previousData: Map<readonly unknown[], Task[]>;
};

export function updateTaskInCache(
  queryClient: QueryClient,
  workspaceId: string,
  taskId: string,
  updater: (task: Task) => Task
): PreviousDataContext {
  const allQueries = queryClient.getQueriesData<Task[]>({
    queryKey: ['tasks', workspaceId],
  });

  const previousData = new Map<readonly unknown[], Task[]>();

  for (const [queryKey, tasks] of allQueries) {
    if (tasks) {
      previousData.set(queryKey, tasks);

      const updated = tasks.map((task) =>
        task.id === taskId ? updater(task) : task
      );
      queryClient.setQueryData(queryKey, updated);
    }
  }

  return { previousData };
}

export function addTaskToCache(
  queryClient: QueryClient,
  workspaceId: string,
  newTask: Task
): PreviousDataContext {
  const allQueries = queryClient.getQueriesData<Task[]>({
    queryKey: ['tasks', workspaceId],
  });

  const previousData = new Map<readonly unknown[], Task[]>();

  for (const [queryKey, tasks] of allQueries) {
    if (tasks) {
      previousData.set(queryKey, tasks);
      queryClient.setQueryData(queryKey, [...tasks, newTask]);
    }
  }

  return { previousData };
}

export function restoreCache(
  queryClient: QueryClient,
  previousData: Map<readonly unknown[], Task[]>
): void {
  for (const [queryKey, data] of previousData) {
    queryClient.setQueryData(queryKey, data);
  }
}
