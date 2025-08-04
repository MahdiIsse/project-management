"use client"

import { Task } from "@/features/task-management/types"
import { useUpdateTasksPositions } from "@/features/task-management/hooks/task"
import { useState, useRef } from "react"
import { DragOverEvent, DragStartEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

interface UseDragAndDropProps {
  tasks: Task[];
  workspaceId: string
}

export function useTaskDragAndDrop({ tasks, workspaceId }: UseDragAndDropProps) {
  const { mutate: updateTasksPositions } = useUpdateTasksPositions(workspaceId)
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const lastCrossColumnRef = useRef<{ at: number; from: string; to: string } | null>(null)

  const displayTasks = localTasks || tasks

  const handleDragStart = (event: DragStartEvent) => {
    const draggingTask = displayTasks.find((task) => task.id === event.active.id);
    setActiveTask(draggingTask || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;

    const isOverATask = over.data.current?.type === "Task";
    const activeIndex = displayTasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;

    if (isOverATask) {
      const overIndex = displayTasks.findIndex((t) => t.id === overId);
      if (overIndex === -1) return;

      const aTask = displayTasks[activeIndex];
      const oTask = displayTasks[overIndex];
      const newTasks = [...displayTasks];

      if (aTask.columnId !== oTask.columnId) {
        const now = Date.now();
        const last = lastCrossColumnRef.current;
        if (last && now - last.at < 80 && last.from === oTask.columnId && last.to === aTask.columnId) {
          return;
        }
        newTasks[activeIndex] = { ...aTask, columnId: oTask.columnId };

        if (newTasks.filter(t => t.id === activeId).length !== 1) return;

        lastCrossColumnRef.current = { at: now, from: aTask.columnId, to: oTask.columnId };
        setLocalTasks(newTasks);
        return;
      }

      if (activeIndex !== overIndex) {
        const reordered = arrayMove(newTasks, activeIndex, overIndex);
        if (reordered.filter(t => t.id === activeId).length !== 1) return;
        setLocalTasks(reordered);
      }
      return;
    }

    const isOverAColumn = over.data.current?.type === "Column"
    if (isOverAColumn) {
      const aTask = displayTasks[activeIndex];
      const targetColumnId = String(overId);

      if (aTask.columnId !== targetColumnId) {
        const now = Date.now();
        const last = lastCrossColumnRef.current;
        if (last && now - last.at < 80 && last.from === targetColumnId && last.to === aTask.columnId) {
          return;
        }

        const newTasks = [...displayTasks];
        newTasks[activeIndex] = { ...aTask, columnId: targetColumnId };

        if (newTasks.filter(t => t.id === activeId).length !== 1) return;

        lastCrossColumnRef.current = { at: now, from: aTask.columnId, to: targetColumnId };
        setLocalTasks(newTasks);
      }
      return;
    }
  }

  const handleDragEnd = () => {
    setActiveTask(null);
    if (!localTasks) {
      setLocalTasks(null);
      return
    }
    const updates = localTasks.map((task, index) => ({
      id: task.id,
      position: index,
      columnId: task.columnId
    }))
    updateTasksPositions({ updates, optimisticTasks: localTasks })
  }

  return {
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    displayTasks,
    activeTask
  }
}