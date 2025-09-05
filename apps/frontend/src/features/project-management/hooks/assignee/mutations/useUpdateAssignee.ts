import { mapAssigneeFromDotNet, Assignee } from '@/features/project-management';
import { apiClient } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assigneeId,
      data,
    }: {
      assigneeId: string;
      data: { name: string; avatarFile?: File };
    }) => {
      const updatedAssignee = await apiClient.updateAssigneeWithFile(
        assigneeId,
        data
      );
      return mapAssigneeFromDotNet(updatedAssignee);
    },
    onMutate: async ({ assigneeId, data }) => {
      const queryKey = ['assignees'];
      await queryClient.cancelQueries({ queryKey });

      const previousAssignees = queryClient.getQueryData<Assignee[]>(queryKey);

      queryClient.setQueryData<Assignee[]>(queryKey, (old) =>
        old?.map((assignee) =>
          assignee.id === assigneeId
            ? { ...assignee, name: data.name }
            : assignee
        )
      );

      return { previousAssignees };
    },
    onError: (_err, _variables, context) => {
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
