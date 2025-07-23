"use client";

import { useState, useMemo } from "react";
import { useColumns } from "@/hooks/column/useColumns";
import { useSearchParams } from "next/navigation";
import { TaskColumn } from "./TaskColumn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnForm } from "../form/ColumnForm";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTasks } from "@/hooks";
import { useTaskDragAndDrop } from "@/hooks/task/useTaskDragAndDrop";
import { useColumnDragAndDrop } from "@/hooks/column/useColumnDragAndDrop";
import { TaskCard } from "./TaskCard";

export function TaskBoard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const {
    data: columns,
    isLoading: columnsLoading,
    isError: columnsError,
  } = useColumns(workspaceId);
  const { data: tasks = [] } = useTasks(workspaceId);

  // Task drag and drop
  const {
    handleDragEnd: handleTaskDragEnd,
    handleDragStart: handleTaskDragStart,
    handleDragOver: handleTaskDragOver,
    displayTasks,
    activeTask,
  } = useTaskDragAndDrop({ tasks, workspaceId });

  // Column drag and drop
  const {
    handleDragStart: handleColumnDragStart,
    handleDragEnd: handleColumnDragEnd,
    displayItems: displayColumns,
    activeItem: activeColumn,
  } = useColumnDragAndDrop({ columns: columns || [], workspaceId });

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // Combined handlers
  const combinedDragStart = (event: DragStartEvent) => {
    const dragType = event.active.data.current?.type;

    if (dragType === "Task") {
      handleTaskDragStart(event);
    } else if (dragType === "Column") {
      handleColumnDragStart(event);
    }
  };

  const combinedDragEnd = (event: DragEndEvent) => {
    const dragType = event.active.data.current?.type;

    if (dragType === "Task") {
      handleTaskDragEnd(event);
    } else if (dragType === "Column") {
      handleColumnDragEnd(event);
    }
  };

  const combinedDragOver = (event: DragOverEvent) => {
    const dragType = event.active.data.current?.type;

    if (dragType === "Task") {
      handleTaskDragOver(event);
    }
    // Column dragging doesn't need dragOver
  };

  const tasksByColumn = useMemo(() => {
    return displayTasks.reduce((acc, task) => {
      if (!acc[task.columnId]) {
        acc[task.columnId] = [];
      }
      acc[task.columnId].push(task);
      return acc;
    }, {} as Record<string, typeof displayTasks>);
  }, [displayTasks]);

  if (columnsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (columnsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Er ging iets mis bij het laden.</p>
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

  if (!columns || columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Eerste kolom toevoegen
            </button>
          </DialogTrigger>
          <DialogContent>
            <ColumnForm
              workspaceId={workspaceId}
              closeDialog={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={combinedDragStart}
      onDragEnd={combinedDragEnd}
      onDragOver={combinedDragOver}
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex h-full flex-col gap-4 lg:flex-row lg:overflow-x-auto">
          <SortableContext
            items={displayColumns.map((column) => column.id)}
            strategy={horizontalListSortingStrategy}
          >
            {displayColumns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn[column.id] || []}
                workspaceId={workspaceId}
                activeTaskId={activeTask?.id}
                activeColumnId={activeColumn?.id}
              />
            ))}
          </SortableContext>

          <DialogTrigger asChild>
            <div className="flex h-fit min-h-[200px] flex-shrink-0 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-6 text-center transition-all duration-200 hover:border-muted-foreground/40 hover:bg-muted/20 hover:shadow-sm lg:w-64 cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">Nieuwe kolom</h3>
                <p className="text-sm text-muted-foreground">
                  Voeg een kolom toe aan je board
                </p>
              </div>
            </div>
          </DialogTrigger>
        </div>

        <DialogContent>
          <ColumnForm
            workspaceId={workspaceId}
            closeDialog={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rotate-12 scale-105 shadow-2xl">
            <TaskCard
              task={activeTask}
              workspaceId={workspaceId}
              columnId={activeTask.columnId}
              index={0}
            />
          </div>
        ) : null}

        {activeColumn ? (
          <div className="rotate-2 scale-105 shadow-2xl">
            <TaskColumn
              column={activeColumn}
              tasks={tasksByColumn[activeColumn.id] || []}
              workspaceId={workspaceId}
              activeTaskId=""
              activeColumnId=""
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
