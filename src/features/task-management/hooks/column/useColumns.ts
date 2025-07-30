import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  updateColumnPositions,
} from "@/features/task-management/actions/column";
import { ColumnSchemaValues } from "@/features/task-management/schemas";
import { Column } from "@/features/task-management/types";

export function useColumns(workspaceId: string){
  return useQuery({
    queryKey: ["columns", workspaceId],
    queryFn: () => getColumns(workspaceId),
    enabled: !!workspaceId
  })
}

export function useCreateColumn(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, data}: {id: string, data: ColumnSchemaValues}) => {
      return createColumn(id, data)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["columns"]})
  })
}

export function useUpdateColumn(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, data}: {id: string, data: ColumnSchemaValues}) => {
      return updateColumn(id, data)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["columns"]})
  })
}

export function useDeleteColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async(id: string) => {
      return deleteColumn(id)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["columns"]})
  })
}

export function useUpdateColumnsPositions(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async({updates}: {
      updates: {id: string, position: number}[];
      optimisticColumns: Column[];
      workspaceId: string
    }) => {
      return updateColumnPositions(updates)
    },
    onMutate: async({optimisticColumns, workspaceId}) => {
      await queryClient.cancelQueries({queryKey: ["columns", workspaceId]}) 

      const previousColumns = queryClient.getQueryData<Column[]>(["columns", workspaceId])

      queryClient.setQueryData(["columns", workspaceId], optimisticColumns)
      return {previousColumns, workspaceId}
    },

    onError: (err, variables, context) => {
      if (context?.previousColumns && context?.workspaceId) {
        queryClient.setQueryData(["columns", context.workspaceId], context.previousColumns)
      } 
    }
  })
}