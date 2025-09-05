import { Column } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateColumnsPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; position: number }>) => {
      const allColumnsData = queryClient.getQueriesData<Column[]>({
        queryKey: ['columns'],
      });
      let workspaceId: string | undefined;

      for (const [, columns] of allColumnsData) {
        if (columns && columns.length > 0) {
          workspaceId = columns[0].workspaceId;
          break;
        }
      }

      if (!workspaceId) {
        throw new Error('Could not determine workspace ID for column updates');
      }

      await apiClient.batchUpdateColumnPositions(workspaceId, updates);

      return updates;
    },

    onMutate: async (updates) => {
      const allQueries = queryClient.getQueriesData<Column[]>({
        queryKey: ['columns'],
      });
      const previousData = new Map(allQueries);

      for (const [queryKey, columns] of allQueries) {
        if (columns) {
          const columnMap = new Map(updates.map((u) => [u.id, u.position]));
          const updated = [...columns]
            .map((column) => {
              const newPosition = columnMap.get(column.id);
              return newPosition !== undefined
                ? { ...column, position: newPosition }
                : column;
            })
            .sort((a, b) => (a.position || 0) - (b.position || 0));

          queryClient.setQueryData(queryKey, updated);
        }
      }

      return { previousData };
    },

    onError: (_err, _updates, context) => {
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
  });
}
