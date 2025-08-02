import {  useMutation, useQueryClient } from "@tanstack/react-query"
import {  addAssigneeToTask, removeAssigneeFromTask } from "@/features/task-management/actions"

export function useAddAssigneeToTask(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({taskId, assigneeId}: {taskId: string, assigneeId: string}) => {
      return addAssigneeToTask(taskId, assigneeId)
    }, 
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tasks"]})
    }
  })
}

export function useRemoveAssigneeFromTask(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async({taskId, assigneeId}: {taskId: string, assigneeId: string}) => {
      return removeAssigneeFromTask(taskId, assigneeId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tasks"]})
    }
  })
} 