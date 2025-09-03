"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useTasks,
  useDeleteTask,
  useTaskFilters,
} from "../../hooks";
import {
  useWorkspaceColumns,
  useColumnDragAndDrop,
} from "../../hooks";
import { StatusTable } from ".";
import { DeleteConfirmDialog } from "../shared";
import { Button, Skeleton } from "../../../../shared";
import { Trash2 } from "lucide-react";

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

export function TaskListView() {
  const { filters } = useTaskFilters();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const { data: tasks, isLoading: tasksLoading } = useTasks(
    workspaceId,
    filters
  );
  const { data: columns, isLoading: columnsLoading } = useWorkspaceColumns(workspaceId);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteTask } = useDeleteTask(workspaceId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const {
    handleDragStart,
    handleDragEnd,
    displayItems: displayColumns,
    activeItem: activeColumn,
  } = useColumnDragAndDrop({ columns: columns || [], workspaceId });

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

  const isLoading = tasksLoading || columnsLoading;

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 py-8 w-full">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded" />
        ))}
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-6 mb-8">
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

        <SortableContext
          items={displayColumns.map((column) => column.id)}
          strategy={verticalListSortingStrategy}
        >
          {displayColumns?.map((column) => {
            const columnTasks = tasksByColumnId[column.id] || [];

            return (
              <StatusTable
                key={column.id}
                tasks={columnTasks}
                onTaskSelect={handleTaskSelect}
                selectedTasks={selectedTasks}
                workspaceId={workspaceId}
                column={column}
              />
            );
          })}
        </SortableContext>

        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemType="taak"
          itemCount={selectedTasks.length}
        />
      </div>

      <DragOverlay>
        {activeColumn ? (
          <div className="rotate-2 scale-105 shadow-2xl opacity-80">
            <StatusTable
              tasks={tasksByColumnId[activeColumn.id] || []}
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
