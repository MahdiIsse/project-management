import { mapTagFromDotNet } from '@/features/project-management/mappings';
import { Tag } from '@/features/project-management/types';
import { apiClient } from '@/shared';
import { useQuery } from '@tanstack/react-query';

export function useTags() {
  return useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: async () => {
      const dotnetTags = await apiClient.getTags();

      return dotnetTags.map(mapTagFromDotNet);
    },
  });
}
