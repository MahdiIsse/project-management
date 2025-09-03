"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/lib/api/client";
import type { Assignee } from "../../types/assignee";
import { mapAssigneeFromDotNet } from "../../mappings/assigneeMapping";
import { toast } from "sonner";

export function useAssignees() {
  return useQuery<Assignee[], Error>({
    queryKey: ["assignees"],
    queryFn: async () => {
      const dotnetAssignees = await apiClient.getAssignees();
      
      return dotnetAssignees.map(mapAssigneeFromDotNet);
    },
  });
}

export function useCreateAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; avatarFile?: File }) => {
      const dotnetAssignee = await apiClient.createAssigneeWithFile(data);
      return mapAssigneeFromDotNet(dotnetAssignee);
    },
    onMutate: async (data) => {
      const queryKey = ["assignees"];
      await queryClient.cancelQueries({ queryKey });

      const previousAssignees = queryClient.getQueryData<Assignee[]>(queryKey);

      const optimisticAssignee: Assignee = {
        id: `optimistic-${Date.now()}`,
        name: data.name,
        avatarUrl: undefined,
      };

      queryClient.setQueryData<Assignee[]>(queryKey, (old) => [
        ...(old || []),
        optimisticAssignee,
      ]);

      return { previousAssignees };
    },
    onError: (_err, _data, context) => {
      if (context?.previousAssignees) {
        queryClient.setQueryData(["assignees"], context.previousAssignees);
      }
      toast.error("Kon de persoon niet aanmaken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assigneeId,
      data,
    }: {
      assigneeId: string;
      data: { name: string; avatarFile?: File };
    }) => {
      const updatedAssignee = await apiClient.updateAssigneeWithFile(assigneeId, data);
      return mapAssigneeFromDotNet(updatedAssignee);
    },
    onMutate: async ({ assigneeId, data }) => {
      const queryKey = ["assignees"];
      await queryClient.cancelQueries({ queryKey });

      const previousAssignees = queryClient.getQueryData<Assignee[]>(queryKey);

      queryClient.setQueryData<Assignee[]>(queryKey, (old) =>
        old?.map((assignee) =>
          assignee.id === assigneeId 
            ? { ...assignee, name: data.name }
            : assignee
        )
      );

      return { previousAssignees };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousAssignees) {
        queryClient.setQueryData(["assignees"], context.previousAssignees);
      }
      toast.error("Kon de persoon niet bijwerken");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeId: string) => {
      await apiClient.deleteAssignee(assigneeId);
      return assigneeId;
    },
    onMutate: async (assigneeId) => {
      const queryKey = ["assignees"];
      await queryClient.cancelQueries({ queryKey });
      const previousAssignees = queryClient.getQueryData<Assignee[]>(queryKey);

      queryClient.setQueryData<Assignee[]>(queryKey, (old) =>
        old?.filter((assignee) => assignee.id !== assigneeId)
      );

      return { previousAssignees };
    },
    onError: (_err, _assigneeId, context) => {
      if (context?.previousAssignees) {
        queryClient.setQueryData(["assignees"], context.previousAssignees);
      }
      toast.error("Kon de persoon niet verwijderen");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}