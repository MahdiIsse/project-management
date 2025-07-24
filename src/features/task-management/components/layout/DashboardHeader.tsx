"use client";

import {
  useDashboardHeader,
  ViewMode,
  HeaderTopRow,
  HeaderBottomRow,
} from "@/features/task-management";
import { List, LayoutGrid, Calendar } from "lucide-react";
import type { TaskFilters } from "@/features/task-management/types";

interface DashboardHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filters: TaskFilters;
  onFiltersChange: (newFilters: Partial<TaskFilters>) => void;
}

export function DashboardHeader({
  currentView,
  onViewChange,
  filters,
  onFiltersChange,
}: DashboardHeaderProps) {
  const {
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
  } = useDashboardHeader({ filters, onFiltersChange });

  const navigationItems = [
    { id: "list" as ViewMode, label: "Lijst", icon: List },
    { id: "board" as ViewMode, label: "Bord", icon: LayoutGrid },
    { id: "calendar" as ViewMode, label: "Kalender", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <HeaderTopRow
        activeWorkspace={activeWorkspace}
        visibleAssignees={visibleAssignees}
        remainingCount={remainingCount}
        isDialogOpen={isDialogOpen}
        onDialogOpenChange={setIsDialogOpen}
        currentWorkspaceId={currentWorkspaceId}
      />
      <HeaderBottomRow
        currentView={currentView}
        onViewChange={onViewChange}
        navigationItems={navigationItems}
        searchTerm={searchTerm}
        onSearchTermChange={(e) => setSearchTerm(e.target.value)}
        activeFilterCount={activeFilterCount}
        assignees={assignees}
        filters={filters}
        handleAssigneeChange={handleAssigneeChange}
        handlePriorityChange={handlePriorityChange}
        handleResetFilters={handleResetFilters}
      />
    </div>
  );
}
