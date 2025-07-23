"use client";

import { useState } from "react";
import { CircleDot, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useWorkspaces,
  useDeleteWorkspace,
} from "@/hooks/workspace/useWorkspaces";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkspaceForm } from "@/components/form/WorkspaceForm";
import { getWorkspaceTextColorByBg } from "@/lib/colors";
import { Workspace } from "@/types";
import { WorkspacesList } from "./WorkspacesList";

export function Workspaces() {
  const { data: workspaces } = useWorkspaces();
  const { mutate: deleteWorkspace } = useDeleteWorkspace();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentWorkspace = searchParams.get("workspace");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Workspace | null>(
    null
  );

  const handleWorkspaceChange = (workspaceId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("workspace", workspaceId);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleAddWorkspace = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setWorkspaceToEdit(workspace);
    setIsEditDialogOpen(true);
  };

  const handleDeleteWorkspace = (workspaceId: string) => {
    if (confirm("Weet je zeker dat je deze workspace wilt verwijderen?")) {
      deleteWorkspace(workspaceId);

      if (currentWorkspace === workspaceId) {
        router.push("/dashboard");
      }
    }
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setWorkspaceToEdit(null);
  };

  return (
    <>
      <SidebarGroup className="mt-6 px-2">
        <div className="flex items-center justify-between px-3 pb-2">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
            Workspaces
          </SidebarGroupLabel>
          <SidebarGroupAction
            title="Add Workspace"
            className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            onClick={handleAddWorkspace}
          >
            <Plus className="h-3 w-3" />
          </SidebarGroupAction>
        </div>
        <SidebarGroupContent>
          <WorkspacesList
            workspaces={workspaces || []}
            currentWorkspace={currentWorkspace}
            onWorkspaceChange={handleWorkspaceChange}
            onEditWorkspace={handleEditWorkspace}
            onDeleteWorkspace={handleDeleteWorkspace}
          />
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nieuwe Workspace aanmaken</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <WorkspaceForm onClose={handleCreateDialogClose} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Workspace bewerken</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <WorkspaceForm
              workspaceToEdit={workspaceToEdit || undefined}
              onClose={handleEditDialogClose}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
