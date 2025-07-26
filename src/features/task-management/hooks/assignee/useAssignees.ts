import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAssignees, createAssignee, updateAssignee, deleteAssignee } from "@/features/task-management"
import { toast } from "sonner"

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
      toast.success("Assignee succesvol verwijderd.")
      queryClient.invalidateQueries({queryKey: ["assignees"]})
    },
    onError: (error)=> {
      toast.error(error.message)
    }

  })
}