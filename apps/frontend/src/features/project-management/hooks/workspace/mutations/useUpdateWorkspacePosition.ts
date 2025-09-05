import { Workspace } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateWorkspacesPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; position: number }[]) => {
      await apiClient.batchUpdateWorkspacePositions(updates);

      return updates;
    },
    onMutate: async (updates) => {
      const queryKey = ['workspaces'];
      await queryClient.cancelQueries({ queryKey });
      const previousWorkspaces =
        queryClient.getQueryData<Workspace[]>(queryKey);

      queryClient.setQueryData<Workspace[]>(queryKey, (old) => {
        if (!old) return [];
        return old.map((workspace) => {
          const update = updates.find((u) => u.id === workspace.id);
          return update
            ? { ...workspace, position: update.position }
            : workspace;
        });
      });

      return { previousWorkspaces };
    },
    onError: (_err, _updates, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(['workspaces'], context.previousWorkspaces);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
}
