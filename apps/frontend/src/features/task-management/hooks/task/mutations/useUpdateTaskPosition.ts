import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../../shared/lib/api/client";
import { toast } from "sonner";
import { Task } from "../../../types";

export function useUpdateTasksPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; position: number; columnId: string }>) => {
      
      const allTasksData = queryClient.getQueriesData<Task[]>({ queryKey: ["tasks"] });
      let workspaceId: string | undefined;
      
      for (const [, tasks] of allTasksData) {
        if (tasks && tasks.length > 0) {
          workspaceId = tasks[0].workspaceId;
          break;
        }
      }
      
      if (!workspaceId) {
        throw new Error("Could not determine workspace ID for task updates");
      }
      
      await apiClient.batchUpdateTaskPositions(workspaceId, updates);
      
      return updates;
    },
    
    onMutate: async (updates) => {
      const allQueries = queryClient.getQueriesData<Task[]>({ queryKey: ["tasks"] });
      const previousData = new Map(allQueries);
      
      for (const [queryKey, tasks] of allQueries) {
        if (tasks) {
          const taskMap = new Map(updates.map(u => [u.id, { position: u.position, columnId: u.columnId }]));
          const updated = [...tasks]
            .map(task => {
              const update = taskMap.get(task.id);
              return update 
                ? { ...task, position: update.position, columnId: update.columnId }
                : task;
            })
            .sort((a, b) => (a.position || 0) - (b.position || 0));
            
          queryClient.setQueryData(queryKey, updated);
        }
      }
      
      return { previousData };
    },
    
    onError: (_err, _updates, context) => {
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      toast.error("Kon taak volgorde niet bijwerken");
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}