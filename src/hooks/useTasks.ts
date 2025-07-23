import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {getTasks, createTask, updateTask, deleteTask, updateTaskPriority, updateTaskDueDate, updateTasksPositions} from "@/actions/taskActions"
import {TaskSchemaValues} from "@/schemas/tasks"
import type {Task} from "@/types"

export function useTasks(workspaceId: string){
  return useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: ()=> getTasks(workspaceId)
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

export function useUpdateTaskPriority(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, priority }: { taskId: string, priority: "Low" | "Medium" | "High" }) => {
      return updateTaskPriority(taskId, priority)
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["tasks"]})
  })
}

export function useUpdateTaskDueDate(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async({taskId, dueDate}: {taskId: string, dueDate: Date}) => {
      return updateTaskDueDate(taskId, dueDate)
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["tasks"]})
  })
}

export function useUpdateTasksPositions(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updates,
      optimisticTasks,
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
