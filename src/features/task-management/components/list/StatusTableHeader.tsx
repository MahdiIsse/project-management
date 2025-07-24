"use client";

import { useState } from "react";
import { Column } from "@/features/task-management/types";
import {
  CollapsibleTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Dialog,
  DialogContent,
} from "@/shared";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Ellipsis,
  Settings,
  Trash2,
  GripVertical,
} from "lucide-react";
import { ColumnForm } from "@/features/task-management/components/form/ColumnForm";
import { useDeleteColumn } from "@/features/task-management/hooks/column/useColumns";
import { cn } from "@/shared";
import { useSortable } from "@dnd-kit/sortable";

interface StatusTableHeaderProps {
  column: Column;
  status: string;
  statusColor: string;
  taskCount: number;
  workspaceId: string;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  dragAttributes?: ReturnType<typeof useSortable>["attributes"];
  dragListeners?: ReturnType<typeof useSortable>["listeners"];
  isDragging?: boolean;
}

export function StatusTableHeader({
  column,
  status,
  statusColor,
  taskCount,
  workspaceId,
  isExpanded,
  onExpandedChange,
  dragAttributes,
  dragListeners,
  isDragging,
}: StatusTableHeaderProps) {
  // ✅ Column actions state (van StatusTable)
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteColumn, isPending: isDeleting } = useDeleteColumn();

  // ✅ Column action handlers (van StatusTable)
  const handleEditColumn = () => {
    setIsColumnFormOpen(true);
  };

  const handleDeleteColumn = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteColumn = () => {
    deleteColumn(column.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const closeColumnForm = () => {
    setIsColumnFormOpen(false);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between p-4 h-auto bg-transparent hover:bg-muted/50",
            isDragging && "opacity-70"
          )}
          onClick={() => onExpandedChange(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <button
              className={cn(
                "h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                "cursor-grab active:cursor-grabbing"
              )}
              {...dragAttributes}
              {...dragListeners}
              // onClick={(e)=> e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}

            {/* Status badge */}
            <div
              className={`px-3 py-1 rounded-md ${statusColor} flex items-center gap-2`}
            >
              <span className="font-semibold">{status}</span>
              <span className="text-sm opacity-70">{taskCount}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Column Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-muted/50 text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Ellipsis className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleEditColumn}
                  className="cursor-pointer"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Kolom bewerken
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteColumn}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Kolom verwijderen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Task Button */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted/50 text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Button>
      </CollapsibleTrigger>

      {/* Column Form Dialog */}
      <Dialog open={isColumnFormOpen} onOpenChange={closeColumnForm}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <ColumnForm
            workspaceId={workspaceId}
            columnToEdit={column}
            closeDialog={closeColumnForm}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kolom verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je &quot;{column.title}&quot; wilt verwijderen?
              Dit zal alle taken in deze kolom permanent verwijderen. Deze actie
              kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteColumn}
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
