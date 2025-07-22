import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {getTasks, createTask, updateTask, deleteTask, updateTaskPriority, updateTaskDueDate} from "@/actions/taskActions"
import {TaskSchemaValues} from "@/schemas/tasks"

export function useTasks(columnId: string, workspaceId: string){
  return useQuery({
    queryKey: ["tasks", workspaceId, columnId],
    queryFn: ()=> getTasks(columnId, workspaceId)
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
    mutationFn: async ({ data, taskId}: {data:TaskSchemaValues, taskId: string}) => {
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