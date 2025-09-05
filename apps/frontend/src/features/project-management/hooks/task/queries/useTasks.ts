import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  Task,
  TaskFilterParams,
  mapTaskFromDotNet,
} from '@/features/project-management';
import { apiClient } from '@/shared';

export function useTasks(workspaceId: string, filters?: TaskFilterParams) {
  const { data: allTasks, ...queryInfo } = useQuery<Task[], Error>({
    queryKey: ['tasks', workspaceId, filters],
    queryFn: async () => {
      const dotnetTasks = await apiClient.getWorkspaceTasks(workspaceId);

      return dotnetTasks.map(mapTaskFromDotNet);
    },
    enabled: !!workspaceId,
  });

  const data = useMemo(() => {
    if (!allTasks) return undefined;

    const hasFilters =
      filters &&
      (filters.search ||
        (filters.priorities && filters.priorities.length > 0) ||
        (filters.assigneeIds && filters.assigneeIds.length > 0));

    if (!hasFilters) {
      return allTasks;
    }

    let filteredTasks = allTasks;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.priorities && filters.priorities.length > 0) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority && filters.priorities!.includes(task.priority)
      );
    }

    if (filters.assigneeIds && filters.assigneeIds.length > 0) {
      filteredTasks = filteredTasks.filter((task) =>
        task.assignees.some((assignee) =>
          filters.assigneeIds!.includes(assignee.id)
        )
      );
    }

    return filteredTasks;
  }, [allTasks, filters]);

  return { ...queryInfo, data };
}
