import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {AssigneeSchemaValues} from "@/schemas/assignees"
import {getAssignees, createAssignee, updateAssignee, deleteAssignee} from "@/actions/assigneeActions"

export function useAssignees() {
  return useQuery({
    queryKey: ["assignees"],
    queryFn: getAssignees
  })
}

export function useCreateAssignee(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({data}: {data: AssigneeSchemaValues}) => {
      return createAssignee(data)
    }, 
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["assignees"]})
  })
}

export function useUpdateAssignee(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({assigneeId, data}: {assigneeId: string, data: AssigneeSchemaValues}) => {
      return updateAssignee(assigneeId, data)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["assignees"]})
  })
}

export function useDeleteAssignee(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assigneeId: string) => {
      return deleteAssignee(assigneeId)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["assignees"]})

  })
}