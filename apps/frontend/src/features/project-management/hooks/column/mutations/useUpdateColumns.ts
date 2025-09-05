import { mapColumnFromDotNet } from '@/features/project-management/mappings';
import { Column } from '@/features/project-management/types';
import { apiClient, UpdateColumnDto } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateColumn(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      columnId,
      data,
    }: {
      columnId: string;
      data: Partial<UpdateColumnDto>;
    }) => {
      const currentColumn = await apiClient.getColumnById(
        workspaceId,
        columnId
      );

      const updateData: UpdateColumnDto = {
        title: data.title ?? currentColumn.title,
        color: data.color ?? currentColumn.color,
        position: data.position ?? currentColumn.position,
      };

      const updatedColumn = await apiClient.updateColumn(
        workspaceId,
        columnId,
        updateData
      );
      return mapColumnFromDotNet(updatedColumn);
    },
    onMutate: async ({ columnId, data }) => {
      const queryKey = ['columns', workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      queryClient.setQueryData<Column[]>(queryKey, (old) =>
        old?.map((column) =>
          column.id === columnId
            ? { ...column, ...data, border: data.color }
            : column
        )
      );

      return { previousColumns };
    },
    onError: (_err, _variables, context) => {
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
