"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/form/TaskForm";
import { Plus, List, LayoutGrid, Calendar, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/hooks/workspace/useWorkspaces";
import { useAssignees } from "@/hooks/assignee/useAssignees";

// View mode type
type ViewMode = "list" | "board" | "calendar";

interface DashboardHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function DashboardHeader({
  currentView,
  onViewChange,
}: DashboardHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get active workspace from search params
  const searchParams = useSearchParams();
  const currentWorkspaceId = searchParams.get("workspace");

  // Real data hooks
  const { data: workspaces = [] } = useWorkspaces();
  const { data: assignees = [] } = useAssignees();

  // Find active workspace from the list
  const activeWorkspace = workspaces.find(
    (workspace) => workspace.id === currentWorkspaceId
  );

  const maxVisibleAssignees = 3;
  const visibleAssignees = assignees.slice(0, maxVisibleAssignees);
  const remainingCount = assignees.length - maxVisibleAssignees;

  const navigationItems = [
    {
      id: "list" as ViewMode,
      label: "Lijst",
      icon: List,
    },
    {
      id: "board" as ViewMode,
      label: "Bord",
      icon: LayoutGrid,
    },
    {
      id: "calendar" as ViewMode,
      label: "Kalender",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Project Title + Avatars + Add Task */}
      <div className="flex justify-between items-start">
        {/* Left: Project Info */}
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

        {/* Right: Avatars + Add Task */}
        <div className="flex items-center gap-4">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {visibleAssignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                className="w-10 h-10 border-2 border-background hover:z-10 transition-all duration-200"
              >
                <AvatarImage
                  src={assignee.avatarUrl || undefined}
                  alt={assignee.name}
                />
                <AvatarFallback className="text-sm font-medium">
                  {assignee.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {remainingCount > 0 && (
              <div className="flex items-center justify-center w-10 h-10 bg-muted border-2 border-background rounded-full">
                <span className="text-xs font-medium text-muted-foreground">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>

          {/* Add Task Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!activeWorkspace}
              >
                <Plus className="w-4 h-4 mr-2" />
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

      {/* Navigation Tabs + Search & Filter Row */}
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

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Search + Filter */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Zoek taken..."
                className="pl-10 pr-4 h-9"
              />
            </div>

            {/* Filter Button */}
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
