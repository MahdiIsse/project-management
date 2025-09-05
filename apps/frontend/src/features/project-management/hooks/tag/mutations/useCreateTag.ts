import { mapTagFromDotNet } from '@/features/project-management/mappings';
import { Tag } from '@/features/project-management/types';
import { apiClient, CreateTagDto } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagDto) => {
      const dotnetTag = await apiClient.createTag(data);
      return mapTagFromDotNet(dotnetTag);
    },
    onMutate: async (data) => {
      const queryKey = ['tags'];
      await queryClient.cancelQueries({ queryKey });

      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      const optimisticTag: Tag = {
        id: `optimistic-${Date.now()}`,
        name: data.name,
        color: data.color,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Tag[]>(queryKey, (old) => [
        ...(old || []),
        optimisticTag,
      ]);

      return { previousTags };
    },
    onError: (_err, _data, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(['tags'], context.previousTags);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
