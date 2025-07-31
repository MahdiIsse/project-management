"use client";

import { MoreHorizontal, Settings, Trash2, CircleDot } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from "@/shared";

import { Workspace } from "@/features/workspace";
import {
  getWorkspaceColorProps,
  getWorkspaceBorderClass,
} from "@/features/workspace/utils/workspace-colors";

interface SortableWorkspaceItemProps {
  workspace: Workspace;
  currentWorkspace: string | null;
  onWorkspaceChange: (id: string) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (id: string) => void;
}

export function SortableWorkspaceItem({
  workspace,
  currentWorkspace,
  onWorkspaceChange,
  onEditWorkspace,
  onDeleteWorkspace,
}: SortableWorkspaceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: workspace.id,
    data: {
      type: "Workspace",
      workspace,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActive = currentWorkspace === workspace.id;
  const colors = getWorkspaceColorProps(workspace.color);
  const borderClass = getWorkspaceBorderClass(workspace.color || undefined);

  return (
    <SidebarMenuItem
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-all duration-200",
        isDragging ? "opacity-50 scale-105 rotate-1 shadow-lg" : "opacity-100"
      )}
    >
      <SidebarMenuButton
        className={cn(
          "h-10 px-3 text-sm font-medium transition-all duration-200 group w-full justify-start relative",
          "hover:scale-[1.02] hover:shadow-sm active:cursor-grabbing",
          "border-l-2 border-transparent",
          isActive
            ? [
                "bg-accent/30 text-foreground",
                borderClass,
                "shadow-sm font-medium",
              ]
            : [
                "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                "hover:" + borderClass.replace("border-l-", "hover:border-l-"),
              ]
        )}
        onClick={() => onWorkspaceChange(workspace.id)}
        {...attributes}
        {...listeners}
      >
        <CircleDot
          className={cn(
            "h-4 w-4 shrink-0 mr-3 transition-all duration-200",
            isActive ? colors.icon : colors.icon,
            "group-hover:scale-110"
          )}
        />
        <span
          className={cn(
            "truncate flex-grow text-left transition-all duration-200",
            isActive && "font-medium"
          )}
        >
          {workspace.title}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded ml-auto shrink-0",
                "hover:bg-white/10 hover:scale-110 active:scale-95",
                isActive ? "hover:bg-white/20" : "hover:bg-accent/50"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onEditWorkspace(workspace)}
              className="cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Bewerken
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteWorkspace(workspace.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Verwijderen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
