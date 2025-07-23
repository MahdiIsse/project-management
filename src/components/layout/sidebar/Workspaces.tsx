"use client";

import { useState } from "react";
import { CircleDot, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";

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
import { useWorkspaces, useDeleteWorkspace } from "@/hooks/useWorkspaces";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkspaceForm } from "@/components/form/WorkspaceForm";
import { getWorkspaceTextColorByBg } from "@/lib/colors";
import type { Tables } from "@/types/database.types";
import { Workspace } from "@/types";

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
          <SidebarMenu className="space-y-1">
            {workspaces?.map((workspace) => (
              <SidebarMenuItem key={workspace.id}>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton
                    asChild
                    isActive={currentWorkspace === workspace.id}
                    className={`flex-1 h-9 px-3 text-sm font-medium transition-colors ${
                      currentWorkspace === workspace.id
                        ? "bg-accent/40 text-accent-foreground border border-border/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    }`}
                  >
                    <button onClick={() => handleWorkspaceChange(workspace.id)}>
                      <CircleDot
                        className={`h-3 w-3 shrink-0 ${getWorkspaceTextColorByBg(
                          workspace.color || ""
                        )}`}
                      />
                      <span className="truncate">{workspace.title}</span>
                    </button>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent/30 transition-colors text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleEditWorkspace(workspace)}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Bewerken
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteWorkspace(workspace.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Verwijderen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
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

      {/* Edit Workspace Dialog */}
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
