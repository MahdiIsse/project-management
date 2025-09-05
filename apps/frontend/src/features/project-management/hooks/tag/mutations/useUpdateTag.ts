import { mapTagFromDotNet } from '@/features/project-management/mappings';
import { Tag } from '@/features/project-management/types';
import { apiClient, UpdateTagDto } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      data,
    }: {
      tagId: string;
      data: UpdateTagDto;
    }) => {
      const updatedTag = await apiClient.updateTag(tagId, data);
      return mapTagFromDotNet(updatedTag);
    },
    onMutate: async ({ tagId, data }) => {
      const queryKey = ['tags'];
      await queryClient.cancelQueries({ queryKey });

      const previousTags = queryClient.getQueryData<Tag[]>(queryKey);

      queryClient.setQueryData<Tag[]>(queryKey, (old) =>
        old?.map((tag) =>
          tag.id === tagId
            ? { ...tag, name: data.name, colorName: data.color }
            : tag
        )
      );

      return { previousTags };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(['tags'], context.previousTags);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
