"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWorkspaces } from "@/features/workspace";
import { useAssignees } from "@/features/task-management";
import type { TaskFilters, Priority } from "@/features/task-management/types";

interface UseDashboardHeaderProps {
  filters: TaskFilters;
  onFiltersChange: (newFilters: Partial<TaskFilters>) => void;
}

export function useDashboardHeader({
  filters,
  onFiltersChange,
}: UseDashboardHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search ?? "");
  const searchParams = useSearchParams();
  const currentWorkspaceId = searchParams.get("workspace");

  const { data: workspaces = [] } = useWorkspaces();
  const { data: assignees = [] } = useAssignees();

  // Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ search: searchTerm });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onFiltersChange]);

  // Sync local search term with global filters
  useEffect(() => {
    setSearchTerm(filters.search ?? "");
  }, [filters.search]);

  // Handlers
  const handleAssigneeChange = (checked: boolean, assigneeId: string) => {
    const currentAssignees = filters.assigneeIds ?? [];
    const newAssigneeIds = checked
      ? [...currentAssignees, assigneeId]
      : currentAssignees.filter((id) => id !== assigneeId);
    onFiltersChange({ assigneeIds: newAssigneeIds });
  };

  const handlePriorityChange = (checked: boolean, priority: Priority) => {
    const currentPriorities = filters.priorities ?? [];
    const newPriorities = checked
      ? [...currentPriorities, priority]
      : currentPriorities.filter((p) => p !== priority);
    onFiltersChange({ priorities: newPriorities });
  };

  const handleResetFilters = () => {
    onFiltersChange({ assigneeIds: [], priorities: [], search: "" });
  };

  // Derived state
  const activeFilterCount =
    (filters.assigneeIds?.length ?? 0) + (filters.priorities?.length ?? 0);

  const activeWorkspace = workspaces.find(
    (ws) => ws.id === currentWorkspaceId
  );

  const maxVisibleAssignees = 3;
  const visibleAssignees = assignees.slice(0, maxVisibleAssignees);
  const remainingCount = assignees.length - maxVisibleAssignees;

  return {
    isDialogOpen,
    setIsDialogOpen,
    searchTerm,
    setSearchTerm,
    currentWorkspaceId,
    assignees,
    activeWorkspace,
    visibleAssignees,
    remainingCount,
    activeFilterCount,
    handleAssigneeChange,
    handlePriorityChange,
    handleResetFilters,
  };
}