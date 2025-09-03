"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ViewMode, TaskForm, ColumnForm } from "../..";
import {
  List,
  LayoutGrid,
  Plus,
  ChevronDown,
  FileText,
  Columns,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  cn,
} from "../../../../shared";
import { useWorkspaces } from "../../../workspace";
import { TaskFilters } from "../filter/TaskFilters";
import { getWorkspaceBorderClass } from "../../../workspace/utils/workspace-colors";

interface DashboardHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function DashboardHeader({
  currentView,
  onViewChange,
}: DashboardHeaderProps) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentWorkspaceId = searchParams.get("workspace");

  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();

  useEffect(() => {
    if (
      !isLoadingWorkspaces &&
      workspaces &&
      workspaces.length > 0 &&
      !currentWorkspaceId
    ) {
      const firstWorkspace = workspaces[0];
      const params = new URLSearchParams(searchParams.toString());
      params.set("workspace", firstWorkspace.id);
      router.replace(`/dashboard?${params.toString()}`);
    }
  }, [
    workspaces,
    currentWorkspaceId,
    isLoadingWorkspaces,
    router,
    searchParams,
  ]);

  const activeWorkspace = workspaces?.find((w) => w.id === currentWorkspaceId);

  const navigationItems = [
    { id: "list" as ViewMode, label: "List", icon: List },
    { id: "board" as ViewMode, label: "Board", icon: LayoutGrid },
  ];

  if (
    isLoadingWorkspaces ||
    (!currentWorkspaceId && workspaces && workspaces.length > 0)
  ) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-l-4 border-l-slate-500 pl-4 sm:pl-6 py-2 gap-3 sm:gap-0">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                Workspace laden...
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none">
              Even geduld terwijl we je workspace voorbereiden
            </p>
          </div>
        </div>
        <div className="border-b pb-4">
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-1 py-3 text-sm font-medium text-muted-foreground/50 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-auto">
                <Button
                  disabled
                  className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto opacity-50"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Nieuw</span>
                  <span className="sm:hidden">Nieuwe taak of kolom</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoadingWorkspaces && (!workspaces || workspaces.length === 0)) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-l-4 border-l-slate-500 pl-4 sm:pl-6 py-2 gap-3 sm:gap-0">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                Welkom bij je dashboard
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Maak je eerste workspace aan om te beginnen
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:justify-between sm:items-start border-l-4 pl-4 sm:pl-6 py-2 gap-3 sm:gap-0",
          getWorkspaceBorderClass(activeWorkspace?.color || undefined)
        )}
      >
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
              {activeWorkspace?.title}
            </h1>
          </div>
          {activeWorkspace?.description && (
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none">
              {activeWorkspace.description}
            </p>
          )}
        </div>
      </div>
      <div className="border-b pb-4">
        <div className="flex flex-col gap-4 sm:flex-row lg:justify-between lg:items-center">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
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
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-auto">
              <TaskFilters />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                  disabled={!activeWorkspace}
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Nieuw</span>
                  <span className="sm:hidden">Nieuwe taak of kolom</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setIsTaskDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Taak toevoegen
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsColumnDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <Columns className="w-4 h-4 mr-2" />
                  Kolom aanmaken
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe taak aanmaken</DialogTitle>
            <DialogDescription>
              Voeg een nieuwe taak toe aan je project
            </DialogDescription>
          </DialogHeader>
          {currentWorkspaceId && (
            <TaskForm
              workspaceId={currentWorkspaceId}
              closeDialog={() => setIsTaskDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuwe kolom aanmaken</DialogTitle>
            <DialogDescription>
              Voeg een nieuwe kolom toe om je taken te organiseren
            </DialogDescription>
          </DialogHeader>
          {currentWorkspaceId && (
            <ColumnForm
              workspaceId={currentWorkspaceId}
              closeDialog={() => setIsColumnDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
