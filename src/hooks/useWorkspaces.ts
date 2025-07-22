import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace} from "@/actions/workspaceActions"
import type {WorkspaceSchemaValues} from "@/schemas/workspace"

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: WorkspaceSchemaValues) => {
     return createWorkspace(data)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["workspaces"]})
  })
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, data}: {id: string, data:WorkspaceSchemaValues }) => {
     return updateWorkspace(id, data)
    },
    onSuccess: ()=> {
      queryClient.invalidateQueries({queryKey: ["workspaces"]})
    }
  })
}

export function useDeleteWorkspace(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteWorkspace(id)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["workspaces"]})
  })
}