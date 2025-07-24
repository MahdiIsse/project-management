"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTasks, useDeleteTask } from "@/features/task-management/hooks";
import {
  useColumns,
  useColumnDragAndDrop,
} from "@/features/task-management/hooks";
import { StatusTable } from "@/features/task-management/components/list";
import { DeleteConfirmDialog } from "@/features/task-management/components/shared";
import type { TaskFilters } from "@/features/task-management/types";
import { COLORS } from "@/shared";
import { Button, Dialog, DialogContent } from "@/shared";
import { Trash2, Plus } from "lucide-react";
import { ColumnForm } from "@/features/task-management/components/form";

import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TaskListViewProps {
  filters: TaskFilters;
}

export function TaskListView({ filters }: TaskListViewProps) {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const { data: tasks, isLoading: tasksLoading } = useTasks(
    workspaceId,
    filters
  );
  const { data: columns, isLoading: columnsLoading } = useColumns(workspaceId);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isColumnFormOpen, setIsColumnFormOpen] = useState(false);

  const { mutate: deleteTask } = useDeleteTask();

  // ✅ Drag & Drop Setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // ✅ Column drag and drop hook
  const {
    handleDragStart,
    handleDragEnd,
    displayItems: displayColumns,
    activeItem: activeColumn,
  } = useColumnDragAndDrop({ columns: columns || [], workspaceId });

  // ✅ Drag handlers
  const onDragStart = (event: DragStartEvent) => {
    const dragType = event.active.data.current?.type;
    if (dragType === "Column") {
      handleDragStart(event);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const dragType = event.active.data.current?.type;
    if (dragType === "Column") {
      handleDragEnd(event);
    }
  };

  // Helper functie voor kolom kleur
  const getColumnColor = (columnId: string) => {
    const column = displayColumns?.find((col) => col.id === columnId);
    if (!column?.border) return "bg-neutral-100 text-neutral-700";

    // Zoek de kleur in COLORS array op basis van border
    const colorMatch = COLORS.find((color) => color.border === column.border);

    if (!colorMatch) return "bg-neutral-100 text-neutral-700";

    return `${colorMatch.colorBg} ${colorMatch.colorText}`;
  };

  const isLoading = tasksLoading || columnsLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-lg font-semibold">Loading tasks...</div>
      </div>
    );
  }

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Selecteer een workspace uit de sidebar.
        </p>
      </div>
    );
  }

  // Groepeer taken per kolom ID - ✅ gebruik displayColumns
  const tasksByColumnId =
    tasks?.reduce((acc, task) => {
      if (!acc[task.columnId]) acc[task.columnId] = [];
      acc[task.columnId].push(task);
      return acc;
    }, {} as Record<string, typeof tasks>) || {};

  const handleTaskSelect = (taskIds: string[]) => {
    setSelectedTasks(taskIds);
  };

  const handleDeleteClick = () => {
    if (selectedTasks.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    selectedTasks.forEach((taskId) => {
      deleteTask(taskId);
    });

    setSelectedTasks([]);
    setIsDeleteDialogOpen(false);
  };

  const handleColumnFormSuccess = () => {
    setIsColumnFormOpen(false);
  };

  return (
    // ✅ DndContext wrapper
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">
            Tasks ({tasks?.length || 0})
            {selectedTasks.length > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({selectedTasks.length} selected)
              </span>
            )}
          </div>

          {selectedTasks.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedTasks.length})
            </Button>
          )}
        </div>

        {/* ✅ SortableContext wrapper */}
        <SortableContext
          items={displayColumns.map((column) => column.id)}
          strategy={verticalListSortingStrategy}
        >
          {displayColumns?.map((column) => {
            const columnTasks = tasksByColumnId[column.id] || [];
            const statusColor = getColumnColor(column.id);

            return (
              <StatusTable
                key={column.id}
                status={column.title}
                tasks={columnTasks}
                statusColor={statusColor}
                onTaskSelect={handleTaskSelect}
                selectedTasks={selectedTasks}
                workspaceId={workspaceId}
                column={column}
              />
            );
          })}
        </SortableContext>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full h-16 border-dashed border-2 hover:border-primary/50 hover:bg-muted/50 transition-colors"
            onClick={() => setIsColumnFormOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nieuwe kolom toevoegen
          </Button>
        </div>

        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          taskCount={selectedTasks.length}
        />

        <Dialog open={isColumnFormOpen} onOpenChange={setIsColumnFormOpen}>
          <DialogContent>
            <ColumnForm
              workspaceId={workspaceId}
              closeDialog={handleColumnFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* ✅ DragOverlay voor preview (voorlopig leeg) */}
      <DragOverlay>
        {activeColumn ? (
          <div className="rotate-2 scale-105 shadow-2xl opacity-80">
            <StatusTable
              status={activeColumn.title}
              tasks={tasksByColumnId[activeColumn.id] || []}
              statusColor={getColumnColor(activeColumn.id)}
              onTaskSelect={() => {}}
              selectedTasks={[]}
              workspaceId={workspaceId}
              column={activeColumn}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
