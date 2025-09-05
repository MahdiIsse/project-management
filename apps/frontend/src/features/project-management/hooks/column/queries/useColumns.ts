import { mapColumnFromDotNet } from '@/features/project-management/mappings';
import { Column } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useQuery } from '@tanstack/react-query';

export function useWorkspaceColumns(workspaceId: string) {
  return useQuery<Column[], Error>({
    queryKey: ['columns', workspaceId],
    queryFn: async () => {
      const dotnetColumns = await apiClient.getWorkspaceColumns(workspaceId);

      return dotnetColumns.map(mapColumnFromDotNet);
    },
    enabled: !!workspaceId,
  });
}
