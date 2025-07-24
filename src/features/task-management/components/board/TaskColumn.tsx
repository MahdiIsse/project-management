"use client";

import { useState } from "react";
import { useDeleteColumn } from "@/features/task-management";
import {
  Badge,
  Button,
  Separator,
  Dialog,
  DialogContent,
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
} from "@/shared";
import { ColumnForm } from "@/features/task-management";
import { Ellipsis, Settings, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/shared";
import type { Column, Task } from "@/features/task-management";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { TaskCard } from "@/features/task-management";

interface TaskColumnProps {
  column: Column;
  workspaceId: string;
  tasks: Task[];
  activeTaskId?: string;
  activeColumnId?: string;
}

export function TaskColumn({
  column,
  workspaceId,
  tasks,
  activeTaskId,
  activeColumnId,
}: TaskColumnProps) {
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { active } = useDndContext();
  const isColumnBeingDragged = active?.data.current?.type === "Column";

  const { mutate: deleteColumn, isPending: isDeleting } = useDeleteColumn();

  // Column sorting
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isColumnDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  // Task dropping (existing)
  const { setNodeRef: setDroppableRef, isOver: isColumnOver } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
      type: "Column",
    },
  });

  // Combine refs
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-4 lg:w-64 flex-shrink-0 min-h-[300px]",
        isColumnOver && tasks.length === 0 && "ring-2 ring-primary/50",
        isColumnDragging && "opacity-50",
        activeColumnId === column.id && "opacity-30"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h2 className="font-bold">{column.title}</h2>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>

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

      <SortableContext
        id={column.id}
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
        disabled={isColumnBeingDragged}
      >
        <div className="flex-grow flex flex-col gap-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={cn(
                "transition-opacity duration-200",
                task.id === activeTaskId && "opacity-30"
              )}
            >
              <TaskCard
                task={task}
                index={index}
                columnId={column.id}
                workspaceId={workspaceId}
              />
            </div>
          ))}

          {tasks.length === 0 && (
            <div
              className={cn(
                "flex items-center justify-center p-12 text-muted-foreground/40 text-sm rounded-lg transition-all",
                isColumnOver &&
                  "bg-primary/5 border border-dashed border-primary/30"
              )}
            >
              Geen taken
            </div>
          )}
        </div>
      </SortableContext>

      {/* Dialogs blijven hetzelfde... */}
      <Dialog open={isColumnFormOpen} onOpenChange={closeColumnForm}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <ColumnForm
            workspaceId={workspaceId}
            columnToEdit={column}
            closeDialog={closeColumnForm}
          />
        </DialogContent>
      </Dialog>

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
