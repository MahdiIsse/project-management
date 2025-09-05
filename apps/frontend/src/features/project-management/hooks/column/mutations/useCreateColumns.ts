import { mapColumnFromDotNet } from '@/features/project-management/mappings';
import { Column } from '@/features/project-management/types';
import { apiClient, CreateColumnDto } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateColumn(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateColumnDto) => {
      const dotnetColumn = await apiClient.createColumn(workspaceId, data);
      return mapColumnFromDotNet(dotnetColumn);
    },
    onMutate: async (data) => {
      const queryKey = ['columns', workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      const optimisticColumn: Column = {
        id: `optimistic-${Date.now()}`,
        title: data.title,
        position: previousColumns?.length ?? 0,
        workspaceId: workspaceId,
        color: data.color,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Column[]>(queryKey, (old) => [
        ...(old || []),
        optimisticColumn,
      ]);

      return { previousColumns };
    },
    onError: (_err, _data, context) => {
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
