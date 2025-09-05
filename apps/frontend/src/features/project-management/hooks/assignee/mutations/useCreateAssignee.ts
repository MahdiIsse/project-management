import { mapAssigneeFromDotNet, Assignee } from '@/features/project-management';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared';

export function useCreateAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; avatarFile?: File }) => {
      const dotnetAssignee = await apiClient.createAssigneeWithFile(data);
      return mapAssigneeFromDotNet(dotnetAssignee);
    },
    onMutate: async (data) => {
      const queryKey = ['assignees'];
      await queryClient.cancelQueries({ queryKey });

      const previousAssignees = queryClient.getQueryData<Assignee[]>(queryKey);

      const optimisticAssignee: Assignee = {
        id: `optimistic-${Date.now()}`,
        name: data.name,
        avatarUrl: undefined,
      };

      queryClient.setQueryData<Assignee[]>(queryKey, (old) => [
        ...(old || []),
        optimisticAssignee,
      ]);

      return { previousAssignees };
    },
    onError: (_err, _data, context) => {
      if (context?.previousAssignees) {
        queryClient.setQueryData(['assignees'], context.previousAssignees);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
