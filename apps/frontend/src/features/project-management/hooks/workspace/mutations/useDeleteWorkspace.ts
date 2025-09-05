import { Workspace } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.deleteWorkspace(id);
      return id;
    },
    onMutate: async (id) => {
      const queryKey = ['workspaces'];
      await queryClient.cancelQueries({ queryKey });
      const previousWorkspaces =
        queryClient.getQueryData<Workspace[]>(queryKey);

      queryClient.setQueryData<Workspace[]>(queryKey, (old) =>
        old?.filter((workspace) => workspace.id !== id)
      );

      return { previousWorkspaces };
    },
    onError: (_err, _id, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(['workspaces'], context.previousWorkspaces);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
}
