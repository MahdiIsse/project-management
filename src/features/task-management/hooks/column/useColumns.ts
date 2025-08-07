"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  updateColumnPositions,
} from "@/features/task-management";
import { Column } from "../../types";
import { ColumnSchemaValues } from "@/features/task-management";
import { useSearchParams } from "next/navigation";

export function useColumns(workspaceId: string) {
  return useQuery<Column[], Error>({
    queryKey: ["columns", workspaceId],
    queryFn: () => getColumns(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useCreateColumn() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ColumnSchemaValues;
    }) => createColumn(id, data),
    onMutate: async ({ data }) => {
      const queryKey = ["columns", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      const optimisticColumn: Column = {
        id: `optimistic-${Date.now()}`,
        title: data.title,
        border: data.border,
        workspaceId: workspaceId,
        position: previousColumns?.length ?? 0,
      };

      queryClient.setQueryData<Column[]>(queryKey, (old) => [
        ...(old || []),
        optimisticColumn,
      ]);

      return { previousColumns };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          ["columns", workspaceId],
          context.previousColumns
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", workspaceId] });
    },
  });
}

export function useUpdateColumn() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ColumnSchemaValues;
    }) => updateColumn(id, data),
    onMutate: async ({ id, data }) => {
      const queryKey = ["columns", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      queryClient.setQueryData<Column[]>(queryKey, (old) =>
        old?.map((column) =>
          column.id === id ? { ...column, ...data } : column
        )
      );

      return { previousColumns };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          ["columns", workspaceId],
          context.previousColumns
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", workspaceId] });
    },
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: (id: string) => deleteColumn(id),
    onMutate: async (id) => {
      const queryKey = ["columns", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      queryClient.setQueryData<Column[]>(queryKey, (old) =>
        old?.filter((column) => column.id !== id)
      );

      return { previousColumns };
    },
    onError: (error, _id, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          ["columns", workspaceId],
          context.previousColumns
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", workspaceId] });
    },
  });
}

export function useUpdateColumnsPositions() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: (updates: { id: string; position: number }[]) =>
      updateColumnPositions(updates),
    onMutate: async (updates) => {
      const queryKey = ["columns", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      queryClient.setQueryData<Column[]>(queryKey, (old) => {
        if (!old) return [];
        return old.map(column => {
            const update = updates.find(u => u.id === column.id);
            return update ? { ...column, position: update.position } : column;
        });
      });
      return { previousColumns };
    },
    onError: (_err, _updates, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          ["columns", workspaceId],
          context.previousColumns
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", workspaceId] });
    },
  });
}