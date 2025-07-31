"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Checkbox,
  Skeleton,
  Button,
} from "@/shared";
import { cn } from "@/shared";
import { Plus, Search, Check, MoreHorizontal } from "lucide-react";
import type { Assignee } from "@/features/task-management/types";
import {
  useAssignees,
  useAddAssigneeToTask,
  useRemoveAssigneeFromTask,
  useDeleteAssignee,
} from "@/features/task-management/hooks";
import { AssigneeForm } from "../form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  Dialog,
  DialogContent,
} from "@/shared/components";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface AssigneeSelectorProps {
  assignees: Assignee[];
  taskId: string;
  maxVisible?: number;
  variant?: "default" | "compact";
}

export function AssigneeSelector({
  taskId,
  maxVisible = 2,
  variant = "default",
  assignees,
}: AssigneeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<
    Assignee | undefined
  >(undefined);

  const { data: allAssigneesData, isLoading: isLoadingAll } = useAssignees();
  const taskAssignees = assignees || [];

  // Action hooks
  const { mutate: addAssignee, isPending: isAdding } = useAddAssigneeToTask();
  const { mutate: removeAssignee, isPending: isRemoving } =
    useRemoveAssigneeFromTask();
  const { mutate: deleteAssignee } = useDeleteAssignee();

  // Filter available assignees based on search
  const allAssignees = allAssigneesData || [];
  const filteredAssignees = allAssignees.filter((assignee) =>
    assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAssigned = (assigneeId: string) =>
    taskAssignees.some((assignee) => assignee.id === assigneeId);

  const handleAssigneeToggle = (assignee: Assignee) => {
    if (isAssigned(assignee.id)) {
      removeAssignee({ taskId, assigneeId: assignee.id });
    } else {
      addAssignee({ taskId, assigneeId: assignee.id });
    }
  };

  const handleEditClick = (assignee: Assignee) => {
    setSelectedAssignee(assignee);
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedAssignee(undefined);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (assignee: Assignee) => {
    setSelectedAssignee(assignee);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAssignee) {
      deleteAssignee(selectedAssignee.id, {
        onSuccess: () => setIsDeleteConfirmOpen(false),
      });
    }
  };

  const visibleAssignees = taskAssignees.slice(0, maxVisible);
  const remainingCount = taskAssignees.length - maxVisible;

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex -space-x-2 cursor-pointer group",
              variant === "compact" && "scale-90"
            )}
          >
            {/* Current Assignees */}
            {visibleAssignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                className={cn(
                  "h-8 w-8 border-2 border-background transition-transform hover:scale-110",
                  variant === "compact" && "h-6 w-6"
                )}
              >
                <AvatarImage
                  src={assignee.avatarUrl || undefined}
                  alt={assignee.name}
                />
                <AvatarFallback className="text-xs font-medium">
                  {assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}

            {/* Remaining Count */}
            {remainingCount > 0 && (
              <Avatar
                className={cn(
                  "h-8 w-8 bg-muted border-2 border-background",
                  variant === "compact" && "h-6 w-6"
                )}
              >
                <AvatarFallback className="text-xs font-medium text-muted-foreground">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            )}

            {taskAssignees.length === 0 && (
              <Avatar
                className={cn(
                  "h-8 w-8 border-2 border-dashed border-muted-foreground/30 bg-muted/50 hover:bg-muted transition-colors",
                  "group-hover:border-primary/50 group-hover:bg-primary/5",
                  variant === "compact" && "h-6 w-6"
                )}
              >
                <AvatarFallback>
                  <Plus
                    className={cn(
                      "h-4 w-4 text-muted-foreground group-hover:text-primary",
                      variant === "compact" && "h-3 w-3"
                    )}
                  />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                Beheer Toegewezen Personen
              </h4>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Zoek personen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Assignees List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {isLoadingAll ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))
              ) : filteredAssignees.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Geen personen gevonden"
                    : "Geen personen beschikbaar"}
                </div>
              ) : (
                filteredAssignees.map((assignee) => {
                  const assigned = isAssigned(assignee.id);

                  return (
                    <div
                      key={assignee.id}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors",
                        "hover:bg-muted/50",
                        assigned && "bg-muted"
                      )}
                      onClick={() => handleAssigneeToggle(assignee)}
                    >
                      {/* Checkbox */}
                      <Checkbox
                        checked={assigned}
                        disabled={isAdding || isRemoving}
                        className="pointer-events-none"
                      />

                      {/* Avatar */}
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={assignee.avatarUrl || undefined}
                          alt={assignee.name}
                        />
                        <AvatarFallback className="text-xs">
                          {assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name */}
                      <span className="flex-1 text-sm font-medium">
                        {assignee.name}
                      </span>

                      {/* Status indicator */}
                      {assigned && <Check className="h-4 w-4 text-green-600" />}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-50 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(assignee)}
                          >
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(assignee)}
                            className="text-red-600"
                          >
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })
              )}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCreateClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe assignee aanmaken
            </Button>

            {/* Footer */}
            {taskAssignees.length > 0 && (
              <div className="pt-2 border-t text-xs text-muted-foreground">
                {taskAssignees.length}{" "}
                {taskAssignees.length === 1 ? "persoon" : "personen"} toegewezen
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <AssigneeForm
            assigneeToEdit={selectedAssignee}
            closeDialog={() => setIsDialogOpen(false)}
            onAssigneeCreated={(newAssignee) => {
              addAssignee(
                {
                  taskId,
                  assigneeId: newAssignee.id,
                },
                {
                  onSuccess: () => {
                    setIsDialogOpen(false);
                  },
                }
              );
            }}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType="assignee"
        itemName={selectedAssignee?.name}
      />
    </>
  );
}
