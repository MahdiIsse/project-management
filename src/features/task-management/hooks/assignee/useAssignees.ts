"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssignees,
  createAssignee,
  updateAssignee,
  deleteAssignee,
} from "@/features/task-management/actions/assignee";
import { Assignee } from "../../types";

export function useAssignees() {
  return useQuery<Assignee[], Error>({
    queryKey: ["assignees"],
    queryFn: getAssignees,
  });
}

export function useCreateAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      createAssignee({ formData }),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assigneeId,
      formData,
    }: {
      assigneeId: string;
      formData: FormData;
    }) => updateAssignee({ assigneeId, formData }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assigneeId: string) => deleteAssignee(assigneeId),
    onMutate: async (assigneeId) => {
      const queryKey = ["assignees"];
      await queryClient.cancelQueries({ queryKey });
      const previousAssignees = queryClient.getQueryData<Assignee[]>(queryKey);

      queryClient.setQueryData<Assignee[]>(queryKey, (old) =>
        old?.filter((assignee) => assignee.id !== assigneeId)
      );

      return { previousAssignees };
    },
    onError: (error, _assigneeId, context) => {
      if (context?.previousAssignees) {
        queryClient.setQueryData(["assignees"], context.previousAssignees);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}