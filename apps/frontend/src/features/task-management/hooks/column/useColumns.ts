"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/lib/api/client";
import type { Column } from "../../types/columns";
import type { CreateColumnDto, UpdateColumnDto } from "../../../../shared/types";
import { mapColumnFromDotNet } from "../../mappings/columnMapping";
import { toast } from "sonner";

export function useWorkspaceColumns(workspaceId: string) {
  return useQuery<Column[], Error>({
    queryKey: ["columns", workspaceId],
    queryFn: async () => {
      const dotnetColumns = await apiClient.getWorkspaceColumns(workspaceId);
      
      return dotnetColumns.map(mapColumnFromDotNet);
    },
    enabled: !!workspaceId,
  });
}

export function useCreateColumn(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateColumnDto) => {
      const dotnetColumn = await apiClient.createColumn(workspaceId, data);
      return mapColumnFromDotNet(dotnetColumn);
    },
    onMutate: async (data) => {
      const queryKey = ["columns", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      const optimisticColumn: Column = {
        id: `optimistic-${Date.now()}`,
        title: data.title,
        position: previousColumns?.length ?? 0,
        workspaceId: workspaceId,
        color: data.color,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Column[]>(queryKey, (old) => [
        ...(old || []),
        optimisticColumn,
      ]);

      return { previousColumns };
    },
    onError: (_err, _data, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns", workspaceId], context.previousColumns);
      }
      toast.error("Kon de kolom niet aanmaken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", workspaceId] });
    },
  });
}

export function useUpdateColumn(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      columnId,
      data,
    }: {
      columnId: string;
      data: Partial<UpdateColumnDto>;
    }) => {
      
      const currentColumn = await apiClient.getColumnById(workspaceId, columnId);
      
      const updateData: UpdateColumnDto = {
        title: data.title ?? currentColumn.title,
        color: data.color ?? currentColumn.color,
        position: data.position ?? currentColumn.position
      };
      
      const updatedColumn = await apiClient.updateColumn(workspaceId, columnId, updateData);
      return mapColumnFromDotNet(updatedColumn);
    },
    onMutate: async ({ columnId, data }) => {
      const queryKey = ["columns", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      queryClient.setQueryData<Column[]>(queryKey, (old) =>
        old?.map((column) =>
          column.id === columnId ? { ...column, ...data, border: data.color } : column
        )
      );

      return { previousColumns };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns", workspaceId], context.previousColumns);
      }
      toast.error("Kon de kolom niet bijwerken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", workspaceId] });
    },
  });
}

export function useDeleteColumn(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (columnId: string) => {
      await apiClient.deleteColumn(workspaceId, columnId);
      return columnId;
    },
    onMutate: async (columnId) => {
      const queryKey = ["columns", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousColumns = queryClient.getQueryData<Column[]>(queryKey);

      queryClient.setQueryData<Column[]>(queryKey, (old) =>
        old?.filter((column) => column.id !== columnId)
      );

      return { previousColumns };
    },
    onError: (_err, _columnId, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(["columns", workspaceId], context.previousColumns);
      }
      toast.error("Kon de kolom niet verwijderen");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", workspaceId] });
    },
  });
}

export function useUpdateColumnsPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; position: number }>) => {
      
      const allColumnsData = queryClient.getQueriesData<Column[]>({ queryKey: ["columns"] });
      let workspaceId: string | undefined;
      
      for (const [, columns] of allColumnsData) {
        if (columns && columns.length > 0) {
          workspaceId = columns[0].workspaceId;
          break;
        }
      }
      
      if (!workspaceId) {
        throw new Error("Could not determine workspace ID for column updates");
      }
      
      await apiClient.batchUpdateColumnPositions(workspaceId, updates);
      
      return updates;
    },
    
    onMutate: async (updates) => {
      const allQueries = queryClient.getQueriesData<Column[]>({ queryKey: ["columns"] });
      const previousData = new Map(allQueries);
      
      for (const [queryKey, columns] of allQueries) {
        if (columns) {
          const columnMap = new Map(updates.map(u => [u.id, u.position]));
          const updated = [...columns]
            .map(column => {
              const newPosition = columnMap.get(column.id);
              return newPosition !== undefined 
                ? { ...column, position: newPosition }
                : column;
            })
            .sort((a, b) => (a.position || 0) - (b.position || 0));
            
          queryClient.setQueryData(queryKey, updated);
        }
      }
      
      return { previousData };
    },
    
    onError: (_err, _updates, context) => {
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      toast.error("Kon de kolom volgorde niet bijwerken");
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });
}