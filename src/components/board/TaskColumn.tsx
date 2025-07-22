"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useUpdateColumn, useDeleteColumn } from "@/hooks/useColumns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TaskCard } from "./TaskCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ColumnForm } from "@/components/form/ColumnForm";
import { Ellipsis, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Column } from "@/types";

interface TaskColumnProps {
  column: Column;
  workspaceId: string;
}

export function TaskColumn({ column, workspaceId }: TaskColumnProps) {
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: tasks = [] } = useTasks(column.id, workspaceId);
  const { mutate: updateColumn } = useUpdateColumn();
  const { mutate: deleteColumn, isPending: isDeleting } = useDeleteColumn();

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
    <div className="flex flex-col gap-4 lg:w-64 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold">{column.title}</h2>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>

        {/* Dropdown Menu voor kolom bewerken/verwijderen */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Ellipsis className="h-4 w-4" />
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
      </div>

      <Separator className={cn("border-t-2", column.border)} />

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} workspaceId={workspaceId} />
      ))}

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
    </div>
  );
}
