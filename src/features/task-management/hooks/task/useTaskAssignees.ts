"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAssigneeToTask,
  removeAssigneeFromTask,
} from "@/features/task-management/actions";
import { useSearchParams } from "next/navigation";
import { Task, Assignee } from "../../types";

export function useAddAssigneeToTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: async ({
      taskId,
      assigneeId,
    }: {
      taskId: string;
      assigneeId: string;
    }) => {
      return addAssigneeToTask(taskId, assigneeId);
    },
    onMutate: async ({ taskId, assigneeId }) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);
      const allAssignees =
        queryClient.getQueryData<Assignee[]>(["assignees"]) ?? [];
      const assigneeToAdd = allAssignees.find((a) => a.id === assigneeId);

      if (previousTasks && assigneeToAdd) {
        queryClient.setQueryData<Task[]>(
          queryKey,
          (old) =>
            old?.map((task) =>
              task.id === taskId
                ? { ...task, assignees: [...task.assignees, assigneeToAdd] }
                : task
            ) || []
        );
      }
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      const queryKey = ["tasks", workspaceId];
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },
    onSettled: () => {
      const queryKey = ["tasks", workspaceId];
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useRemoveAssigneeFromTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: async ({
      taskId,
      assigneeId,
    }: {
      taskId: string;
      assigneeId: string;
    }) => {
      return removeAssigneeFromTask(taskId, assigneeId);
    },
    onMutate: async ({ taskId, assigneeId }) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          queryKey,
          (old) =>
            old?.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    assignees: task.assignees.filter(
                      (a) => a.id !== assigneeId
                    ),
                  }
                : task
            ) || []
        );
      }
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      const queryKey = ["tasks", workspaceId];
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },
    onSettled: () => {
      const queryKey = ["tasks", workspaceId];
      queryClient.invalidateQueries({ queryKey });
    },
  });
}