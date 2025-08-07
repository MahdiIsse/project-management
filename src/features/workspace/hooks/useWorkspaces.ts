"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  updateWorkspacesPositions,
} from "@/features/workspace/actions/workspaceActions";
import type { Workspace } from "@/features/workspace/types";
import { WorkspaceSchemaValues } from "../schemas";
import { toast } from "sonner";

export function useWorkspaces() {
  return useQuery<Workspace[], Error>({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkspaceSchemaValues) => createWorkspace(data),
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
        ownerId: "", 
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
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkspaceSchemaValues>;
    }) => updateWorkspace(id, data),
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
    mutationFn: (id: string) => deleteWorkspace(id),
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
    mutationFn: (updates: { id: string; position: number }[]) =>
      updateWorkspacesPositions(updates),
    onMutate: async (updates) => {
      const queryKey = ["workspaces"];
      await queryClient.cancelQueries({ queryKey });
      const previousWorkspaces =
        queryClient.getQueryData<Workspace[]>(queryKey);

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



