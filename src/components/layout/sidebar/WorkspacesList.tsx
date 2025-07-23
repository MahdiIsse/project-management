"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import { SidebarMenu } from "@/components/ui/sidebar";
import { useWorkspaceDragAndDrop } from "@/hooks/workspace/useWorkspaceDragAndDrop";
import { SortableWorkspaceItem } from "./SortableWorkspaceItem";
import { Workspace } from "@/types";

interface WorkspacesListProps {
  workspaces: Workspace[];
  currentWorkspace: string | null;
  onWorkspaceChange: (id: string) => void;
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (id: string) => void;
}

export function WorkspacesList({
  workspaces,
  currentWorkspace,
  onWorkspaceChange,
  onEditWorkspace,
  onDeleteWorkspace,
}: WorkspacesListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const { handleDragStart, handleDragEnd, displayItems, activeItem } =
    useWorkspaceDragAndDrop({ workspaces });

  if (!workspaces || workspaces.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={displayItems.map((workspace) => workspace.id)}>
        <SidebarMenu className="space-y-1">
          {displayItems.map((workspace) => (
            <SortableWorkspaceItem
              key={workspace.id}
              workspace={workspace}
              currentWorkspace={currentWorkspace}
              onWorkspaceChange={onWorkspaceChange}
              onEditWorkspace={onEditWorkspace}
              onDeleteWorkspace={onDeleteWorkspace}
            />
          ))}
        </SidebarMenu>
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <div className="rotate-2 scale-105 shadow-2xl">
            <SortableWorkspaceItem
              workspace={activeItem}
              currentWorkspace={currentWorkspace}
              onWorkspaceChange={() => {}}
              onEditWorkspace={() => {}}
              onDeleteWorkspace={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
