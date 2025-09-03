import { useMutation, useQueryClient } from "@tanstack/react-query";
import { convertPriorityToBackend, CreateTaskInput } from "../../../types";
import { apiClient } from "../../../../../shared/lib/api/client";
import { mapTaskFromDotNet } from "../../../mappings";
import { toast } from "sonner";
import { CreateProjectTaskDto } from "../../../../../shared";

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ columnId, data }: CreateTaskInput) => {
      
      const apiData: CreateProjectTaskDto = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: convertPriorityToBackend(data.priority),
      };
      
      const dotnetTask = await apiClient.createTask(workspaceId, columnId, apiData);
      let finalTask = mapTaskFromDotNet(dotnetTask);
      
      if (data.assigneeIds && data.assigneeIds.length > 0) {
        
        for (const assigneeId of data.assigneeIds) {
          const updatedTask = await apiClient.addAssigneeToTask(workspaceId, finalTask.id, assigneeId);
          finalTask = mapTaskFromDotNet(updatedTask);
        }
      }
      
      if (data.tagIds && data.tagIds.length > 0) {
        
        for (const tagId of data.tagIds) {
          const updatedTask = await apiClient.addTagToTask(workspaceId, finalTask.id, tagId);
          finalTask = mapTaskFromDotNet(updatedTask);
        }
      }
      
      
      return finalTask;
    },
    
    onError: (_err, _data, context) => {
      toast.error("Kon de taak niet aanmaken");
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}