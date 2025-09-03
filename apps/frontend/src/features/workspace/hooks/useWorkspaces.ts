"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/api/client";
import type { Workspace } from "../types";
import type { CreateWorkspaceDto, UpdateWorkspaceDto } from "../../../shared/types";
import { WorkspaceSchemaValues } from "../schemas";
import { toast } from "sonner";
import { mapWorkspaceFromDotNet } from "../mappings/workspaceMapping";

export function useWorkspaces() {
  return useQuery<Workspace[], Error>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const dotnetWorkspaces = await apiClient.getWorkspaces();
      
      return dotnetWorkspaces.map(mapWorkspaceFromDotNet);
    },
    retry: 1,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WorkspaceSchemaValues) => {
      const createData: CreateWorkspaceDto = {
        title: data.title,
        description: data.description,
        color: data.color,
      };
      
      const dotnetWorkspace = await apiClient.createWorkspace(createData);
      return mapWorkspaceFromDotNet(dotnetWorkspace);
    },
    onMutate: async (data) => {
      const queryKey = ["workspaces"];
      await queryClient.cancelQueries({ queryKey });

      const previousWorkspaces = queryClient.getQueryData<Workspace[]>(queryKey);

      const optimisticWorkspace: Workspace = {
        id: `optimistic-${Date.now()}`,
        title: data.title,
        description: data.description,
        color: data.color,
        position: previousWorkspaces?.length ?? 0,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Workspace[]>(queryKey, (old) => [
        ...(old || []),
        optimisticWorkspace,
      ]);

      return { previousWorkspaces };
    },
    onError: (_err, _data, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(["workspaces"], context.previousWorkspaces);
      }
      toast.error("Kon de workspace niet aanmaken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkspaceSchemaValues>;
    }) => {
      const currentWorkspace = await apiClient.getWorkspaceById(id);
      
      const updateData: UpdateWorkspaceDto = {
        title: data.title ?? currentWorkspace.title,
        description: data.description ?? currentWorkspace.description,
        color: data.color ?? currentWorkspace.color,
        position: data.position ?? currentWorkspace.position
      };
      
      const updatedWorkspace = await apiClient.updateWorkspace(id, updateData);
      return mapWorkspaceFromDotNet(updatedWorkspace);
    },
    onMutate: async ({ id, data }) => {
      const queryKey = ["workspaces"];
      await queryClient.cancelQueries({ queryKey });

      const previousWorkspaces = queryClient.getQueryData<Workspace[]>(queryKey);

      queryClient.setQueryData<Workspace[]>(queryKey, (old) =>
        old?.map((workspace) =>
          workspace.id === id ? { ...workspace, ...data } : workspace
        )
      );

      return { previousWorkspaces };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(["workspaces"], context.previousWorkspaces);
      }
      toast.error("Kon de workspace niet bijwerken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.deleteWorkspace(id);
      return id;
    },
    onMutate: async (id) => {
      const queryKey = ["workspaces"];
      await queryClient.cancelQueries({ queryKey });
      const previousWorkspaces = queryClient.getQueryData<Workspace[]>(queryKey);

      queryClient.setQueryData<Workspace[]>(queryKey, (old) =>
        old?.filter((workspace) => workspace.id !== id)
      );

      return { previousWorkspaces };
    },
    onError: (_err, _id, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(["workspaces"], context.previousWorkspaces);
      }
      toast.error("Kon de workspace niet verwijderen");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useUpdateWorkspacesPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; position: number }[]) => {
      await apiClient.batchUpdateWorkspacePositions(updates);
      
      return updates;
    },
    onMutate: async (updates) => {
      const queryKey = ["workspaces"];
      await queryClient.cancelQueries({ queryKey });
      const previousWorkspaces = queryClient.getQueryData<Workspace[]>(queryKey);

      queryClient.setQueryData<Workspace[]>(queryKey, (old) => {
        if (!old) return [];
        return old.map((workspace) => {
          const update = updates.find((u) => u.id === workspace.id);
          return update ? { ...workspace, position: update.position } : workspace;
        });
      });

      return { previousWorkspaces };
    },
    onError: (_err, _updates, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(["workspaces"], context.previousWorkspaces);
      }
      toast.error("Kon de volgorde van de workspaces niet opslaan");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
