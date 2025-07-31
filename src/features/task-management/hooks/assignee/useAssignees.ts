import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAssignees, createAssignee, updateAssignee, deleteAssignee } from "@/features/task-management"

export function useAssignees() {
  return useQuery({
    queryKey: ["assignees"],
    queryFn: getAssignees
  })
}

export function useCreateAssignee(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({formData}: {formData: FormData}) => {
      return createAssignee({formData})
    }, 
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["assignees"]})
  })
}

export function useUpdateAssignee(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({assigneeId, formData}: {assigneeId: string, formData: FormData}) => {
      return updateAssignee({assigneeId, formData})
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
    onSuccess: ()=> {
      queryClient.invalidateQueries({queryKey: ["assignees"]})
    },

  })
}