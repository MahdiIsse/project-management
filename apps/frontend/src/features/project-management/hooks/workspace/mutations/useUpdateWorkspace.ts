import { mapWorkspaceFromDotNet } from '@/features/project-management/mappings';
import { WorkspaceSchemaValues } from '@/features/project-management/schemas';
import { Workspace } from '@/features/project-management/types';
import { apiClient, UpdateWorkspaceDto } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkspaceSchemaValues>;
    }) => {
      const currentWorkspace = await apiClient.getWorkspaceById(id);

      const updateData: UpdateWorkspaceDto = {
        title: data.title ?? currentWorkspace.title,
        description: data.description ?? currentWorkspace.description,
        color: data.color ?? currentWorkspace.color,
        position: data.position ?? currentWorkspace.position,
      };

      const updatedWorkspace = await apiClient.updateWorkspace(id, updateData);
      return mapWorkspaceFromDotNet(updatedWorkspace);
    },
    onMutate: async ({ id, data }) => {
      const queryKey = ['workspaces'];
      await queryClient.cancelQueries({ queryKey });

      const previousWorkspaces =
        queryClient.getQueryData<Workspace[]>(queryKey);

      queryClient.setQueryData<Workspace[]>(queryKey, (old) =>
        old?.map((workspace) =>
          workspace.id === id ? { ...workspace, ...data } : workspace
        )
      );

      return { previousWorkspaces };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(['workspaces'], context.previousWorkspaces);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
}
