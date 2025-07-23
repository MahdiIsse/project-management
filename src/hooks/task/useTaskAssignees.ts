import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {getTaskAssignees, addAssigneeToTask, removeAssigneeFromTask} from "@/actions/taskAssigneeActions"

export function useTaskAssignees(taskId: string){
  return useQuery({
    queryKey: ["taskAssignees", taskId],
    queryFn: () => getTaskAssignees(taskId),
    enabled: !!taskId
  })
}

export function useAddAssigneeToTask(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({taskId, assigneeId}: {taskId: string, assigneeId: string}) => {
      return addAssigneeToTask(taskId, assigneeId)
    }, 
    onSuccess: (data, variables) => queryClient.invalidateQueries({queryKey: ["taskAssignees", variables.taskId]})
  })
}

export function useRemoveAssigneeFromTask(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async({taskId, assigneeId}: {taskId: string, assigneeId: string}) => {
      return removeAssigneeFromTask(taskId, assigneeId)
    },
    onSuccess: (data, variables) => queryClient.invalidateQueries({queryKey: ["taskAssignees", variables.taskId]})
  })
} 