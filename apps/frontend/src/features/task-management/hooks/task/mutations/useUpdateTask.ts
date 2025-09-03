import { useMutation, useQueryClient } from "@tanstack/react-query";
import { convertPriorityToBackend, UpdateTaskInput } from "../../../types";
import { apiClient } from "../../../../../shared/lib/api/client";
import { UpdateProjectTaskDto } from "../../../../../shared";
import { mapTaskFromDotNet } from "../../../mappings";
import { toast } from "sonner";


export function useUpdateTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, data }: UpdateTaskInput) => {
      
      const currentTask = await apiClient.getTaskById(workspaceId, taskId);
      
      const updateData: UpdateProjectTaskDto = {
        title: data.title ?? currentTask.title,
        description: data.description ?? currentTask.description,
        dueDate: data.dueDate ?? currentTask.dueDate,
        priority: data.priority 
          ? convertPriorityToBackend(data.priority)
          : currentTask.priority,
        columnId: data.columnId ?? currentTask.columnId,
        position: data.position ?? currentTask.position
      };
      
      const updatedTask = await apiClient.updateTask(workspaceId, taskId, updateData);
      return mapTaskFromDotNet(updatedTask);
    },
    
    onError: (_err, _variables, context) => {
      toast.error("Kon de taak niet bijwerken");
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}