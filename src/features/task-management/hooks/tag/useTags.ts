import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTags, createTag, updateTag, deleteTag } from "@/features/task-management/actions"
import { TagSchemaValues } from "@/features/task-management/schemas"

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTags
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TagSchemaValues) => {
      return createTag(data)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["tags"]})
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({tagId, data}: {tagId: string, data: TagSchemaValues}) => {
      return updateTag(data, tagId)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["tags"]})
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tagId: string) => {
      return deleteTag(tagId)
    },
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["tags"]})

  })
}