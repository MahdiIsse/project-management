import { Assignee } from '@/features/project-management';
import { apiClient } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeId: string) => {
      await apiClient.deleteAssignee(assigneeId);
      return assigneeId;
    },
    onMutate: async (assigneeId) => {
      const queryKey = ['assignees'];
      await queryClient.cancelQueries({ queryKey });
      const previousAssignees = queryClient.getQueryData<Assignee[]>(queryKey);

      queryClient.setQueryData<Assignee[]>(queryKey, (old) =>
        old?.filter((assignee) => assignee.id !== assigneeId)
      );

      return { previousAssignees };
    },
    onError: (_err, _assigneeId, context) => {
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
