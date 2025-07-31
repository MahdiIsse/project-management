"use client";

import { useState } from "react";
import { Task, Column } from "@/features/task-management/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Dialog,
  DialogContent,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/shared";
import {
  GripVertical,
  ChevronDown,
  Ellipsis,
  Settings,
  Trash2,
} from "lucide-react";
import { TaskForm, ColumnForm } from "@/features/task-management";
import { TaskTableRow } from "./TaskTableRow";
import { useDeleteColumn } from "@/features/task-management/hooks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/shared";
import { getColumnColorByBorder } from "@/features/task-management/utils/columnColors";
import { DeleteConfirmDialog } from "../shared";

interface StatusTableProps {
  tasks: Task[];
  column: Column;
  workspaceId: string;
  onTaskSelect?: (taskIds: string[]) => void;
  selectedTasks?: string[];
}

export function StatusTable({
  tasks,
  column,
  workspaceId,
  onTaskSelect,
  selectedTasks = [],
}: StatusTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { mutate: deleteColumn } = useDeleteColumn();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: "Column", column } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 🚀 NIEUW: Kleuren ophalen met de helper
  const { columnBg, columnText } = getColumnColorByBorder(column.border);

  const handleTaskNameClick = (task: Task) => setTaskToEdit(task);

  const handleSelectAll = (checked: boolean) => {
    const taskIds = tasks.map((task) => task.id);
    const selectedTaskIdsSet = new Set(selectedTasks);
    taskIds.forEach((id) =>
      checked ? selectedTaskIdsSet.add(id) : selectedTaskIdsSet.delete(id)
    );
    onTaskSelect?.(Array.from(selectedTaskIdsSet));
  };

  const handleTaskSelect = (taskId: string, checked: boolean) => {
    const newSelected = new Set(selectedTasks);
    if (checked) newSelected.add(taskId);
    else newSelected.delete(taskId);
    onTaskSelect?.(Array.from(newSelected));
  };

  const confirmDeleteColumn = () => {
    deleteColumn(column.id, {
      onSuccess: () => setIsDeleteConfirmOpen(false),
    });
  };

  const allTaskIdsInThisColumn = tasks.map((t) => t.id);
  const selectedTasksInThisColumn = selectedTasks.filter((id) =>
    allTaskIdsInThisColumn.includes(id)
  );
  const isAllSelected =
    tasks.length > 0 && selectedTasksInThisColumn.length === tasks.length;

  return (
    <>
      {/* 1. De "Frame" container */}
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "rounded-lg overflow-hidden border bg-background",
          isDragging && "opacity-50 scale-[0.98] shadow-lg z-50"
        )}
      >
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <Table className="table-fixed">
            <colgroup>
              <col className="w-12" />
              <col className="w-64" />
              <col className="w-24" />
              <col className="w-32" />
              <col className="w-20" />
              <col className="w-28" />
              <col className="w-32" />
            </colgroup>
            <TableHeader>
              {/* 2. De Gekleurde, Klikbare Header */}
              <CollapsibleTrigger asChild>
                <TableRow className={cn("hover:bg-opacity-90", columnBg)}>
                  <TableHead colSpan={7} className="p-0 cursor-pointer">
                    <div className="flex items-center justify-between p-2">
                      <div
                        className={cn("flex items-center gap-3", columnText)}
                      >
                        <span
                          className="cursor-grab active:cursor-grabbing p-2"
                          {...attributes}
                          {...listeners}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="h-4 w-4" />
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            !isExpanded && "-rotate-90"
                          )}
                        />
                        <span className="font-semibold">{column.title}</span>
                        <span className="text-sm opacity-70">
                          {tasks.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Ellipsis className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsColumnFormOpen(true);
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Kolom bewerken
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteConfirmOpen(true);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Kolom verwijderen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </CollapsibleTrigger>
              {/* 3. De Kolomtitels */}
              <TableRow className="border-b bg-muted/30 text-xs uppercase hover:bg-muted/40">
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            {/* 4. De Inklapbare Content */}
            <CollapsibleContent asChild>
              <TableBody>
                {tasks.map((task) => (
                  <TaskTableRow
                    key={task.id}
                    task={task}
                    isSelected={selectedTasks.includes(task.id)}
                    onSelect={handleTaskSelect}
                    onEdit={handleTaskNameClick}
                  />
                ))}
              </TableBody>
            </CollapsibleContent>
          </Table>
        </Collapsible>
      </div>

      {/* Dialogs blijven hier, buiten de tabel */}
      <Dialog open={isColumnFormOpen} onOpenChange={setIsColumnFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {column ? "Kolom bewerken" : "Nieuwe kolom"}
            </DialogTitle>
            <DialogDescription>
              {column
                ? `Bewerk de instellingen van kolom "${column.title}"`
                : "Maak een nieuwe kolom aan voor je taken"}
            </DialogDescription>
          </DialogHeader>
          <ColumnForm
            workspaceId={workspaceId}
            columnToEdit={column}
            closeDialog={() => setIsColumnFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!taskToEdit}
        onOpenChange={(open) => !open && setTaskToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Taak bewerken</DialogTitle>
            <DialogDescription>
              {taskToEdit
                ? `Bewerk de details van "${taskToEdit.title}"`
                : "Taak bewerken"}
            </DialogDescription>
          </DialogHeader>
          {taskToEdit && (
            <TaskForm
              workspaceId={workspaceId}
              taskToEdit={taskToEdit}
              closeDialog={() => setTaskToEdit(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteColumn}
        itemType="kolom"
        itemName={column.title}
      />
    </>
  );
}
