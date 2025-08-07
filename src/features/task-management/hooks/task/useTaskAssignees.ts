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
            old?.map((task) => {
              if (task.id === taskId) {
                const assigneeExists = task.assignees.some(
                  (a) => a.id === assigneeId
                );
                if (assigneeExists) {
                  return task;
                }
                return {
                  ...task,
                  assignees: [...task.assignees, assigneeToAdd],
                };
              }
              return task;
            }) || []
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
            old?.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  assignees: task.assignees.filter(
                    (a) => a.id !== assigneeId
                  ),
                };
              }
              return task;
            }) || []
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
  });
}