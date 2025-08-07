"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTasksPositions,
} from "@/features/task-management";
import {
  Task,
  TaskFilterParams,
  Assignee,
  Tag,
} from "../../types";
import { useSearchParams } from "next/navigation";
import { TaskSchemaValues } from "@/features/task-management";
import { useMemo } from "react";

export function useTasks(workspaceId: string, filters?: TaskFilterParams) {
  const { data: allTasks, ...queryInfo } = useQuery<Task[], Error>({
    queryKey: ["tasks", workspaceId],
    queryFn: () => getTasks(workspaceId),
    enabled: !!workspaceId,
  });

  const data = useMemo(() => {
    if (!allTasks) return undefined;

    const hasFilters =
      filters &&
      (filters.search ||
        (filters.priorities && filters.priorities.length > 0) ||
        (filters.assigneeIds && filters.assigneeIds.length > 0));

    if (!hasFilters) {
      return allTasks;
    }

    let filteredTasks = allTasks;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.priorities && filters.priorities.length > 0) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority && filters.priorities!.includes(task.priority)
      );
    }

    if (filters.assigneeIds && filters.assigneeIds.length > 0) {
      filteredTasks = filteredTasks.filter((task) =>
        task.assignees.some((assignee) =>
          filters.assigneeIds!.includes(assignee.id)
        )
      );
    }

    return filteredTasks;
  }, [allTasks, filters]);

  return { ...queryInfo, data };
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: TaskSchemaValues;
    }) => createTask(workspaceId, data),
    onMutate: async ({ data }) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      const allAssignees =
        queryClient.getQueryData<Assignee[]>(["assignees"]) ?? [];
      const allTags = queryClient.getQueryData<Tag[]>(["tags"]) ?? [];

      const optimisticTask: Task = {
        id: `optimistic-${Date.now()}`,
        title: data.title,
        description: data.description,
        columnId: data.columnId,
        priority: data.priority,
        dueDate: data.dueDate,
        workspaceId: workspaceId,
        assignees: data.assigneeIds
          .map((id) => allAssignees.find((a) => a.id === id))
          .filter((a): a is Assignee => !!a),
        tags: data.tagIds
          .map((id) => allTags.find((t) => t.id === id))
          .filter((t): t is Tag => !!t),
        position:
          previousTasks?.filter((t) => t.columnId === data.columnId).length ??
          0,
      };

      queryClient.setQueryData<Task[]>(queryKey, (old) => [
        ...(old || []),
        optimisticTask,
      ]);

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

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: ({
      data,
      taskId,
    }: {
      data: Partial<TaskSchemaValues>;
      taskId: string;
    }) => updateTask(data, taskId),
    onMutate: async ({ data, taskId }) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      const allAssignees =
        queryClient.getQueryData<Assignee[]>(["assignees"]) ?? [];
      const allTags = queryClient.getQueryData<Tag[]>(["tags"]) ?? [];

      queryClient.setQueryData<Task[]>(queryKey, (oldTasks) =>
        oldTasks?.map((task) => {
          if (task.id === taskId) {
            const updatedTask: Task = { ...task };
            if (data.title !== undefined) updatedTask.title = data.title;
            if (data.description !== undefined)
              updatedTask.description = data.description;
            if (data.columnId !== undefined)
              updatedTask.columnId = data.columnId;
            if (data.dueDate !== undefined) updatedTask.dueDate = data.dueDate;
            if (data.priority !== undefined)
              updatedTask.priority = data.priority;
            if (data.position !== undefined)
              updatedTask.position = data.position;
            if (data.assigneeIds) {
              updatedTask.assignees = data.assigneeIds
                .map((id) => allAssignees.find((a) => a.id === id))
                .filter((a): a is Assignee => !!a);
            }
            if (data.tagIds) {
              updatedTask.tags = data.tagIds
                .map((id) => allTags.find((t) => t.id === id))
                .filter((t): t is Tag => !!t);
            }
            return updatedTask;
          }
          return task;
        }) ?? []
      );
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

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onMutate: async (taskId: string) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(
        queryKey,
        (old) => old?.filter((task) => task.id !== taskId) || []
      );
      return { previousTasks };
    },
    onError: (_err, _taskId, context) => {
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

export function useUpdateTasksPositions() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  return useMutation({
    mutationFn: (updates: { id: string; columnId: string; position: number }[]) =>
      updateTasksPositions(updates),
    onMutate: async (updates) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (oldTasks) => {
        if (!oldTasks) return [];
        const newTasks = oldTasks.map((task) => {
          const update = updates.find((u) => u.id === task.id);
          if (update) {
            return {
              ...task,
              position: update.position,
              columnId: update.columnId,
            };
          }
          return task;
        });
        return newTasks;
      });
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
