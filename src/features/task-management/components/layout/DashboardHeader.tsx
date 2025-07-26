"use client";

import {
  useDashboardHeader,
  ViewMode,
  TaskFilters,
  priorityOptions,
  Priority,
  Assignee,
  TaskForm,
} from "@/features/task-management";
import { List, LayoutGrid, Calendar, Search, Filter, Plus } from "lucide-react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Label,
  Checkbox,
  Separator,
  Badge,
  Dialog,
  DialogContent,
  DialogTrigger,
  cn,
} from "@/shared";

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
      {/* Top Row: Title and Description */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {activeWorkspace?.title || "Selecteer een workspace..."}
            </h1>
          </div>
          {activeWorkspace?.description && (
            <p className="text-muted-foreground">
              {activeWorkspace.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Navigation, Filters, and Actions */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center">
          {/* Left: Navigation Tabs */}
          <div className="flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors relative",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Search, Filter, and Add Task Button */}
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Zoek taken..."
                className="pl-10 pr-4 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-1">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Pas filters toe om taken te verfijnen.
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <div className="space-y-1">
                      {assignees.map((assignee) => (
                        <div key={assignee.id} className="flex items-center">
                          <Checkbox
                            id={`assignee-${assignee.id}`}
                            checked={(filters.assigneeIds ?? []).includes(
                              assignee.id
                            )}
                            onCheckedChange={(checked) =>
                              handleAssigneeChange(
                                Boolean(checked),
                                assignee.id
                              )
                            }
                          />
                          <Label
                            htmlFor={`assignee-${assignee.id}`}
                            className="ml-2 text-sm font-normal"
                          >
                            {assignee.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="space-y-1">
                      {priorityOptions.map((priority) => (
                        <div key={priority.value} className="flex items-center">
                          <Checkbox
                            id={`priority-${priority.value}`}
                            checked={(filters.priorities ?? []).includes(
                              priority.value
                            )}
                            onCheckedChange={(checked) =>
                              handlePriorityChange(
                                Boolean(checked),
                                priority.value
                              )
                            }
                          />
                          <Label
                            htmlFor={`priority-${priority.value}`}
                            className="ml-2 text-sm font-normal"
                          >
                            {priority.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!activeWorkspace}
                >
                  <Plus className="w-3 h-3" />
                  Taak Toevoegen
                </Button>
              </DialogTrigger>
              {currentWorkspaceId && (
                <DialogContent>
                  <TaskForm
                    workspaceId={currentWorkspaceId}
                    closeDialog={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
