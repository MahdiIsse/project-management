"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/lib/api/client";
import type { Task, UpdateTaskInput, CreateTaskInput } from "../../types/task";
import type { CreateProjectTaskDto, UpdateProjectTaskDto } from "../../../../shared/types";
import { mapTaskFromDotNet } from "../../mappings/taskMapping";
import { toast } from "sonner";
import { TaskFilterParams } from "../../types";
import { useMemo } from "react";
import { convertPriorityToBackend } from "../../types/priority";

export function useTasks(workspaceId: string, filters?: TaskFilterParams) {
  const { data: allTasks, ...queryInfo } = useQuery<Task[], Error>({
    queryKey: ["tasks", workspaceId, filters],
    queryFn: async () => {
      const dotnetTasks = await apiClient.getWorkspaceTasks(workspaceId);
      
      return dotnetTasks.map(mapTaskFromDotNet);
    },
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

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ columnId, data }: CreateTaskInput) => {
      
      const apiData: CreateProjectTaskDto = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: convertPriorityToBackend(data.priority),
      };
      
      const dotnetTask = await apiClient.createTask(workspaceId, columnId, apiData);
      let finalTask = mapTaskFromDotNet(dotnetTask);
      
      if (data.assigneeIds && data.assigneeIds.length > 0) {
        for (const assigneeId of data.assigneeIds) {
          const updatedTask = await apiClient.addAssigneeToTask(workspaceId, finalTask.id, assigneeId);
          finalTask = mapTaskFromDotNet(updatedTask);
        }
      }
      
      if (data.tagIds && data.tagIds.length > 0) {
        for (const tagId of data.tagIds) {
          const updatedTask = await apiClient.addTagToTask(workspaceId, finalTask.id, tagId);
          finalTask = mapTaskFromDotNet(updatedTask);
        }
      }
      
      return finalTask;
    },
    
    onError: (_err, _data, context) => {
      toast.error("Kon de taak niet aanmaken");
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}

export function useUpdateTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, data }: UpdateTaskInput) => {
      
      const currentTask = await apiClient.getTaskById(workspaceId, taskId);
      
      const updateData: UpdateProjectTaskDto = {
        title: data.title ?? currentTask.title,
        description: data.description ?? currentTask.description,
        dueDate: data.dueDate ?? currentTask.dueDate,
        priority: data.priority 
          ? convertPriorityToBackend(data.priority)
          : currentTask.priority,
        columnId: data.columnId ?? currentTask.columnId,
        position: data.position ?? currentTask.position
      };
      
      const updatedTask = await apiClient.updateTask(workspaceId, taskId, updateData);
      return mapTaskFromDotNet(updatedTask);
    },
    
    onError: (_err, _variables, context) => {
      toast.error("Kon de taak niet bijwerken");
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await apiClient.deleteTask(workspaceId, taskId);
      return taskId;
    },
    onMutate: async (taskId) => {
      const queryKey = ["tasks", workspaceId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old?.filter((task) => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", workspaceId], context.previousTasks);
      }
      toast.error("Kon de taak niet verwijderen");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}

export function useAddAssigneeToTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) => {
      const updatedTask = await apiClient.addAssigneeToTask(workspaceId, taskId, assigneeId);
      return mapTaskFromDotNet(updatedTask);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}

export function useRemoveAssigneeFromTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, assigneeId }: { taskId: string; assigneeId: string }) => {
      const updatedTask = await apiClient.removeAssigneeFromTask(workspaceId, taskId, assigneeId);
      return mapTaskFromDotNet(updatedTask);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });
}

export function useUpdateTasksPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; position: number; columnId: string }>) => {
      
      const allTasksData = queryClient.getQueriesData<Task[]>({ queryKey: ["tasks"] });
      let workspaceId: string | undefined;
      
      for (const [, tasks] of allTasksData) {
        if (tasks && tasks.length > 0) {
          workspaceId = tasks[0].workspaceId;
          break;
        }
      }
      
      if (!workspaceId) {
        throw new Error("Could not determine workspace ID for task updates");
      }
      
      await apiClient.batchUpdateTaskPositions(workspaceId, updates);
      
      return updates;
    },
    
    onMutate: async (updates) => {
      const allQueries = queryClient.getQueriesData<Task[]>({ queryKey: ["tasks"] });
      const previousData = new Map(allQueries);
      
      for (const [queryKey, tasks] of allQueries) {
        if (tasks) {
          const taskMap = new Map(updates.map(u => [u.id, { position: u.position, columnId: u.columnId }]));
          const updated = [...tasks]
            .map(task => {
              const update = taskMap.get(task.id);
              return update 
                ? { ...task, position: update.position, columnId: update.columnId }
                : task;
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
      toast.error("Kon taak volgorde niet bijwerken");
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
