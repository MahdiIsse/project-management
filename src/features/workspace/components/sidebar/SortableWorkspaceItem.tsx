"use client";

import {
  GripVertical,
  MoreHorizontal,
  Edit,
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
} from "@/shared";
import { getWorkspaceTextColorByBg, cn } from "@/shared";
import { Workspace } from "@/features/workspace";

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

  return (
    <SidebarMenuItem ref={setNodeRef} style={style}>
      <div
        className={cn(
          "flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center",
          isDragging ? "opacity-50" : ""
        )}
      >
        <div className="flex items-center flex-1 min-w-0 group-data-[collapsible=icon]:flex-none">
          <button
            className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing group-data-[collapsible=icon]:hidden"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </button>

          <SidebarMenuButton
            asChild
            isActive={currentWorkspace === workspace.id}
            className={cn(
              "flex-1 h-9 px-3 text-sm font-medium transition-colors ml-1 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center",
              currentWorkspace === workspace.id
                ? "bg-accent/40 text-accent-foreground border border-border/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            )}
          >
            <button onClick={() => onWorkspaceChange(workspace.id)}>
              <CircleDot
                className={cn(
                  "h-3 w-3 shrink-0 mr-2 group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4",
                  getWorkspaceTextColorByBg(workspace.color || "")
                )}
              />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                {workspace.title}
              </span>
            </button>
          </SidebarMenuButton>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent/30 transition-colors text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onEditWorkspace(workspace)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
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
      </div>
    </SidebarMenuItem>
  );
}
