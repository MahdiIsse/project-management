import { Tag } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      await apiClient.deleteTag(tagId);
      return tagId;
    },
    onMutate: async (tagId) => {
      const queryKey = ['tags'];
      await queryClient.cancelQueries({ queryKey });
      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      queryClient.setQueryData<Tag[]>(queryKey, (old) =>
        old?.filter((tag) => tag.id !== tagId)
      );

      return { previousTags };
    },
    onError: (_err, _tagId, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(['tags'], context.previousTags);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
