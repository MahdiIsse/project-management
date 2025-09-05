import { mapWorkspaceFromDotNet } from '@/features/project-management/mappings';
import { WorkspaceSchemaValues } from '@/features/project-management/schemas';
import { Workspace } from '@/features/project-management/types';
import { apiClient, CreateWorkspaceDto } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkspaceSchemaValues) => {
      const createData: CreateWorkspaceDto = {
        title: data.title,
        description: data.description,
        color: data.color,
      };

      const dotnetWorkspace = await apiClient.createWorkspace(createData);
      return mapWorkspaceFromDotNet(dotnetWorkspace);
    },
    onMutate: async (data) => {
      const queryKey = ['workspaces'];
      await queryClient.cancelQueries({ queryKey });

      const previousWorkspaces =
        queryClient.getQueryData<Workspace[]>(queryKey);

      const optimisticWorkspace: Workspace = {
        id: `optimistic-${Date.now()}`,
        title: data.title,
        description: data.description,
        color: data.color,
        position: previousWorkspaces?.length ?? 0,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Workspace[]>(queryKey, (old) => [
        ...(old || []),
        optimisticWorkspace,
      ]);

      return { previousWorkspaces };
    },
    onError: (_err, _data, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(['workspaces'], context.previousWorkspaces);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
}
