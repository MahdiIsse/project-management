import { mapAssigneeFromDotNet, Assignee } from '@/features/project-management';
import { apiClient } from '@/shared';
import { useQuery } from '@tanstack/react-query';

export function useAssignees() {
  return useQuery<Assignee[], Error>({
    queryKey: ['assignees'],
    queryFn: async () => {
      const dotnetAssignees = await apiClient.getAssignees();

      return dotnetAssignees.map(mapAssigneeFromDotNet);
    },
  });
}
