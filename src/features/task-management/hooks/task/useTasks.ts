import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTasks, createTask, updateTask, deleteTask, updateTasksPositions } from "@/features/task-management/actions"
import { TaskSchemaValues } from "@/features/task-management/schemas"
import type { Task } from "@/features/task-management/types"

export function useTasks(workspaceId: string){
  return useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: ()=> getTasks(workspaceId),
    enabled: !!workspaceId
  })
}

export function useCreateTask(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({workspaceId, data}: {workspaceId: string, data:TaskSchemaValues}) => {
      return createTask(workspaceId, data)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["tasks"]})
  })
}

export function useUpdateTask(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data, taskId}: {data: Partial<Task>, taskId: string}) => {
      return updateTask(data, taskId)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["tasks"]})
  })
}

export function useDeleteTask(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteTask(id)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["tasks"]})
  })
}

export function useUpdateTasksPositions(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updates,
    }: {
      updates: { id: string; columnId: string; position: number }[];
      optimisticTasks: Task[];
    }) => {
      return updateTasksPositions(updates);
    },

    onMutate: async ({
      optimisticTasks,
    }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", workspaceId] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", workspaceId]);

      queryClient.setQueryData(["tasks", workspaceId], optimisticTasks);

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", workspaceId], context.previousTasks);
      }
    }
  });
}
