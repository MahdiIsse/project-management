import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace, updateWorkspacesPositions } from "@/features/workspace"
import type { Workspace, WorkspaceSchemaValues } from "@/features/workspace"

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: WorkspaceSchemaValues): Promise<Workspace> => {
     return createWorkspace(data)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["workspaces"]})
  })
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, data}: {id: string, data: Partial<WorkspaceSchemaValues> }) => {
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

export function useUpdateWorkspacesPositions(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async({updates}: 
      {
        updates: {id: string, position: number}[];
        optimisticWorkspaces: Workspace[]
    }) => {
      return updateWorkspacesPositions(updates)
    },
    onMutate: async ({optimisticWorkspaces}) => {
      await queryClient.cancelQueries({queryKey: ["workspaces"]})

      const previousWorkspaces = queryClient.getQueryData<Workspace[]>(["workspaces"])

      queryClient.setQueryData(["workspaces"], optimisticWorkspaces)
      return {previousWorkspaces}
    },

    onError: (err, variables, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(["workspaces"], context.previousWorkspaces)
      }
    }
  })
}



