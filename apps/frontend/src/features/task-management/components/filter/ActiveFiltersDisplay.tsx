"use client";

import { useTaskFilters } from "../../hooks/task/useTaskFilters";
import { useAssignees } from "../../hooks/assignee/useAssignees";
import { Badge, Button } from "../../../../shared";
import { X, ListFilter } from "lucide-react";
import { priorityOptions } from "../../types";

export function ActiveFiltersDisplay() {
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useTaskFilters();
  const { data: assignees } = useAssignees();

  if (!hasActiveFilters) {
    return null;
  }

  const handleRemoveSearch = () => {
    updateFilters({ search: undefined });
  };

  const handleRemovePriority = (priorityToRemove: string) => {
    const newPriorities = filters.priorities?.filter(
      (p) => p !== priorityToRemove
    );
    updateFilters({ priorities: newPriorities });
  };

  const handleRemoveAssignee = (assigneeIdToRemove: string) => {
    const newAssigneeIds = filters.assigneeIds?.filter(
      (id) => id !== assigneeIdToRemove
    );
    updateFilters({ assigneeIds: newAssigneeIds });
  };

  const getPriorityLabel = (value: string) => {
    return priorityOptions.find((p) => p.value === value)?.label || value;
  };

  const getAssigneeName = (id: string) => {
    return assignees?.find((a) => a.id === id)?.name || id;
  };

  return (
    <div className="bg-muted/20 border rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            <ListFilter className="h-4 w-4 mr-2" />
            <span>Actieve Filters:</span>
          </div>
          {filters.search && (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 pl-2 pr-1 bg-background border"
            >
              Zoek: &quot;{filters.search}&quot;
              <button
                onClick={handleRemoveSearch}
                className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.priorities?.map((priority) => (
            <Badge
              key={priority}
              variant="outline"
              className="flex items-center gap-1.5 pl-2 pr-1 bg-background border"
            >
              Prioriteit: {getPriorityLabel(priority)}
              <button
                onClick={() => handleRemovePriority(priority)}
                className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.assigneeIds?.map((assigneeId) => (
            <Badge
              key={assigneeId}
              variant="outline"
              className="flex items-center gap-1.5 pl-2 pr-1 bg-background border"
            >
              Assignee: {getAssigneeName(assigneeId)}
              <button
                onClick={() => handleRemoveAssignee(assigneeId)}
                className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4 mr-1" />
          Wis alles
        </Button>
      </div>
    </div>
  );
}
