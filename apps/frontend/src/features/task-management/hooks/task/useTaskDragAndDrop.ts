"use client"

import { Task } from "../../types"
import { useUpdateTasksPositions } from "./useTasks";
import { useState, useCallback, useMemo } from "react"
import { DragOverEvent, DragStartEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { debounce } from "lodash"

interface UseDragAndDropProps {
  tasks: Task[];
  workspaceId: string
}

export function useTaskDragAndDrop({ tasks }: UseDragAndDropProps) {
  const { mutate: updateTasksPositions } = useUpdateTasksPositions();
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const displayTasks = useMemo(() => {
    return localTasks || tasks
  }, [localTasks, tasks])

  const debouncedColumnUpdate = useMemo(
    () => debounce((newTasks: Task[]) => {
      setLocalTasks(newTasks)
    }, 50),
    []
  )

  const handleDragStart = (event: DragStartEvent) => {
    const draggingTask = displayTasks.find((task) => task.id === event.active.id);
    setActiveTask(draggingTask || null);
  };

  const handleDragOver = useCallback((event: DragOverEvent) => {
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
        newTasks[activeIndex] = { ...aTask, columnId: oTask.columnId };
        if (newTasks.filter(t => t.id === activeId).length !== 1) return;
        
        debouncedColumnUpdate(newTasks);
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
        const newTasks = [...displayTasks];
        newTasks[activeIndex] = { ...aTask, columnId: targetColumnId };
        if (newTasks.filter(t => t.id === activeId).length !== 1) return;

        debouncedColumnUpdate(newTasks);
      }
      return;
    }
  }, [displayTasks, debouncedColumnUpdate])

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
    updateTasksPositions(updates);
  }

  return {
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    displayTasks,
    activeTask
  }
}