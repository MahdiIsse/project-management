'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Dialog, DialogContent, DialogTrigger } from '@/shared';
import {
  useWorkspaceColumns,
  useColumnDragAndDrop,
  useTasks,
  useTaskDragAndDrop,
  useTaskFilters,
  TaskColumn,
  TaskCard,
  ColumnForm,
} from '@/features/project-management';

export function TaskBoard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { filters } = useTaskFilters();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspace') ?? '';

  const {
    data: columns,
    isLoading: columnsLoading,
    isError: columnsError,
  } = useWorkspaceColumns(workspaceId);

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = useTasks(workspaceId, filters);

  const isBoardLoading = columnsLoading || tasksLoading;
  const isBoardError = columnsError || tasksError;

  const {
    handleDragEnd: handleTaskDragEnd,
    handleDragStart: handleTaskDragStart,
    handleDragOver: handleTaskDragOver,
    displayTasks,
    activeTask,
  } = useTaskDragAndDrop({ tasks, workspaceId });

  const {
    handleDragStart: handleColumnDragStart,
    handleDragEnd: handleColumnDragEnd,
    displayItems: displayColumns,
    activeItem: activeColumn,
  } = useColumnDragAndDrop({ columns: columns || [], workspaceId });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const combinedDragStart = (event: DragStartEvent) => {
    const dragType = event.active.data.current?.type;
    if (dragType === 'Task') {
      handleTaskDragStart(event);
    } else if (dragType === 'Column') {
      handleColumnDragStart(event);
    }
  };

  const combinedDragEnd = (event: DragEndEvent) => {
    const dragType = event.active.data.current?.type;
    if (dragType === 'Task') {
      handleTaskDragEnd();
    } else if (dragType === 'Column') {
      handleColumnDragEnd(event);
    }
  };

  const combinedDragOver = (event: DragOverEvent) => {
    const dragType = event.active.data.current?.type;
    if (dragType === 'Task') {
      handleTaskDragOver(event);
    }
  };

  const tasksByColumn = useMemo(() => {
    return displayTasks.reduce(
      (acc, task) => {
        if (!acc[task.columnId]) {
          acc[task.columnId] = [];
        }
        acc[task.columnId].push(task);
        return acc;
      },
      {} as Record<string, typeof displayTasks>
    );
  }, [displayTasks]);

  if (isBoardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isBoardError) {
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
        <div className="h-full flex flex-col mb-6">
          <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:overflow-x-auto">
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
          </div>
        </div>
      </Dialog>

      <DragOverlay>
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
