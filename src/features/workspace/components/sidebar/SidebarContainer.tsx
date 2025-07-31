"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import {
  useWorkspaces,
  useDeleteWorkspace,
  useWorkspaceDragAndDrop,
  Workspace,
  WorkspaceForm,
  SortableWorkspaceItem,
} from "@/features/workspace";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroupAction,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared";
import { Plus } from "lucide-react";
import Image from "next/image";
import { NavUser } from "./nav-user";

interface SidebarContainerProps {
  user: User | null;
  logout: () => Promise<void>;
}

export function SidebarContainer({ user, logout }: SidebarContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: workspaces = [] } = useWorkspaces();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();

  const {
    handleDragStart,
    handleDragEnd,
    displayItems: displayedWorkspaces,
    activeItem: activeWorkspace,
  } = useWorkspaceDragAndDrop({ workspaces });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Workspace | undefined>(
    undefined
  );
  const [workspaceToDeleteId, setWorkspaceToDeleteId] = useState<
    string | undefined
  >(undefined);

  const currentWorkspaceId = searchParams.get("workspace");
  const workspaceToDelete = workspaces.find(
    (ws) => ws.id === workspaceToDeleteId
  );

  const navUser = user
    ? {
        name:
          user.user_metadata?.full_name ||
          (typeof user.user_metadata?.email === "string"
            ? user.user_metadata.email.split("@")[0]
            : undefined) ||
          "Gast",
        email: user.email || "gebruiker@email.com",
        avatar: user.user_metadata?.avatar_url || "",
      }
    : null;

  const handleWorkspaceChange = (workspaceId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("workspace", workspaceId);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleAddWorkspace = () => {
    setWorkspaceToEdit(undefined);
    setIsWorkspaceDialogOpen(true);
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setWorkspaceToEdit(workspace);
    setIsWorkspaceDialogOpen(true);
  };

  const confirmDeleteWorkspace = () => {
    if (workspaceToDeleteId) {
      deleteWorkspace(workspaceToDeleteId, {
        onSuccess: () => {
          if (currentWorkspaceId === workspaceToDeleteId) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("workspace");
            router.push(`/dashboard?${params.toString()}`);
          }
          setWorkspaceToDeleteId(undefined);
        },
      });
    }
  };

  const handleWorkspaceDialogClose = () => {
    setIsWorkspaceDialogOpen(false);
    setWorkspaceToEdit(undefined);
  };

  return (
    <>
      <Sidebar className="border-r bg-background">
        <SidebarHeader className="border-b border-border/40 bg-background">
          <div className="flex items-center py-2 px-6">
            <div className="h-[50px] w-[160px] relative font-bold text-lg flex items-center">
              <Image
                src="/Logo-White.png"
                alt="automationlabs logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 bg-background">
          <SidebarGroup className="px-2">
            <div className="flex items-center justify-between px-3 pb-2">
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                Workspaces
              </SidebarGroupLabel>
              <SidebarGroupAction
                title="Add Workspace"
                className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
                onClick={handleAddWorkspace}
              >
                <Plus className="h-3 w-3" />
              </SidebarGroupAction>
            </div>
            <SidebarGroupContent>
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={displayedWorkspaces.map((ws) => ws.id)}>
                  <SidebarMenu className="space-y-1">
                    {displayedWorkspaces.map((workspace) => (
                      <SortableWorkspaceItem
                        key={workspace.id}
                        workspace={workspace}
                        currentWorkspace={currentWorkspaceId}
                        onWorkspaceChange={handleWorkspaceChange}
                        onEditWorkspace={handleEditWorkspace}
                        onDeleteWorkspace={(id) => setWorkspaceToDeleteId(id)}
                      />
                    ))}
                  </SidebarMenu>
                </SortableContext>
                <DragOverlay>
                  {activeWorkspace ? (
                    <div className="rotate-2 scale-105 shadow-2xl">
                      <SortableWorkspaceItem
                        workspace={activeWorkspace}
                        currentWorkspace={currentWorkspaceId}
                        onWorkspaceChange={() => {}}
                        onEditWorkspace={() => {}}
                        onDeleteWorkspace={() => {}}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 bg-background p-2">
          {navUser && <NavUser user={navUser} logout={logout} />}
        </SidebarFooter>
      </Sidebar>

      <Dialog
        open={isWorkspaceDialogOpen}
        onOpenChange={handleWorkspaceDialogClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {workspaceToEdit
                ? "Workspace bewerken"
                : "Nieuwe Workspace aanmaken"}
            </DialogTitle>
          </DialogHeader>
          <WorkspaceForm
            workspaceToEdit={workspaceToEdit}
            onClose={handleWorkspaceDialogClose}
            onWorkspaceCreated={handleWorkspaceChange}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!workspaceToDeleteId}
        onOpenChange={() => setWorkspaceToDeleteId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Workspace verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je &quot;{workspaceToDelete?.title}&quot; wilt
              verwijderen? Dit zal alle taken, kolommen en andere data permanent
              verwijderen. Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setWorkspaceToDeleteId(undefined)}
            >
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWorkspace}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Verwijderen..." : "Verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
