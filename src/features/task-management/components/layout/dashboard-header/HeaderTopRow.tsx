"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared";
import { TaskForm } from "@/features/task-management/components/form";
import { Plus } from "lucide-react";
import type { Assignee } from "@/features/task-management/types";
import type { Workspace } from "@/features/workspace/types";

interface HeaderTopRowProps {
  activeWorkspace?: Workspace;
  visibleAssignees: Assignee[];
  remainingCount: number;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  currentWorkspaceId: string | null;
}

export function HeaderTopRow({
  activeWorkspace,
  visibleAssignees,
  remainingCount,
  isDialogOpen,
  onDialogOpenChange,
  currentWorkspaceId,
}: HeaderTopRowProps) {
  return (
    <div className="flex justify-between items-start">
      {/* Left: Project Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">
            {activeWorkspace?.title || "Selecteer een workspace..."}
          </h1>
        </div>
        {activeWorkspace?.description && (
          <p className="text-muted-foreground">{activeWorkspace.description}</p>
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
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
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
                closeDialog={() => onDialogOpenChange(false)}
              />
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}
