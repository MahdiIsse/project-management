"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ViewMode, TaskForm } from "@/features/task-management";
import { List, LayoutGrid, Calendar, Plus } from "lucide-react";
import { Button, Dialog, DialogContent, DialogTrigger, cn } from "@/shared";
import { useWorkspaces } from "@/features/workspace";

interface DashboardHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function DashboardHeader({
  currentView,
  onViewChange,
}: DashboardHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentWorkspaceId = searchParams.get("workspace");

  const { data: workspaces } = useWorkspaces();

  const activeWorkspace = workspaces?.find((w) => w.id === currentWorkspaceId);

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
