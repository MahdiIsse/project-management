"use client";

import {
  GripVertical,
  MoreHorizontal,
  Settings,
  Trash2,
  CircleDot,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  cn,
  getWorkspaceColor,
} from "@/shared";

import { Workspace } from "@/features/workspace";
import {
  WORKSPACE_COLORS,
  getWorkspaceColorProps,
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

  return (
    <SidebarMenuItem
      ref={setNodeRef}
      style={style}
      className={cn(isDragging ? "opacity-50" : "")}
    >
      <SidebarMenuButton
        className={cn(
          "h-9 px-3 text-sm font-medium transition-colors group w-full justify-start",
          isActive
            ? "bg-accent/40 text-accent-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
        )}
        onClick={() => onWorkspaceChange(workspace.id)}
      >
        <button
          className="h-6 w-6 flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing -ml-2 shrink-0"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <CircleDot className={cn("h-4 w-4 shrink-0", colors.icon)} />
        <span className="truncate flex-grow text-left">{workspace.title}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent/50 rounded ml-auto shrink-0"
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
