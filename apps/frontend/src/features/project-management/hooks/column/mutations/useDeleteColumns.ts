import { Column } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteColumn(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (columnId: string) => {
      await apiClient.deleteColumn(workspaceId, columnId);
      return columnId;
    },
    onMutate: async (columnId) => {
      const queryKey = ['columns', workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      queryClient.setQueryData<Column[]>(queryKey, (old) =>
        old?.filter((column) => column.id !== columnId)
      );

      return { previousColumns };
    },
    onError: (_err, _columnId, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          ['columns', workspaceId],
          context.previousColumns
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', workspaceId] });
    },
  });
}
