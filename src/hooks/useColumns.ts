import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {getColumns, createColumn, updateColumn, deleteColumn} from "@/actions/columnActions"
import {ColumnSchemaValues} from "@/schemas/columns"

export function useColumns(workspaceId: string){
  return useQuery({
    queryKey: ["columns", workspaceId],
    queryFn: () => getColumns(workspaceId)
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