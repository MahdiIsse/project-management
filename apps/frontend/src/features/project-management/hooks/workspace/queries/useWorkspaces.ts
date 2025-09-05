import { mapWorkspaceFromDotNet } from '@/features/project-management/mappings';
import { Workspace } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useQuery } from '@tanstack/react-query';

export function useWorkspaces() {
  return useQuery<Workspace[], Error>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const dotnetWorkspaces = await apiClient.getWorkspaces();

      return dotnetWorkspaces.map(mapWorkspaceFromDotNet);
    },
    retry: 1,
  });
}
