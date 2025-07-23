import { Task } from "@/types"
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable";
import { useUpdateTasksPositions } from "./useTasks";
import { useState } from "react";

interface UseDragAndDropProps {
  tasks: Task[];
  workspaceId: string
}

export function useDragAndDrop({ tasks, workspaceId }: UseDragAndDropProps) {
  const { mutate: updateTasksPositions } = useUpdateTasksPositions(workspaceId)
  const [localTasks, setLocalTasks] = useState<Task[] | null>(null)
  // ✅ activeTask state naar de hook verplaatst
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const displayTasks = localTasks || tasks

  const handleDragStart = (event: DragStartEvent) => {
    // ✅ Zoek de dragging task in displayTasks
    const draggingTask = displayTasks.find(
      (task) => task.id === event.active.id
    );
    setActiveTask(draggingTask || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    const activeIndex = displayTasks.findIndex((t) => t.id === activeId);
    const overIndex = displayTasks.findIndex((t) => t.id === overId);

    if (activeIndex === -1) return;

    // 🎯 Case 1: Task over task
    if (isActiveATask && isOverATask && overIndex !== -1) {
      const activeTask = displayTasks[activeIndex];
      const overTask = displayTasks[overIndex];
      
      const newTasks = [...displayTasks]

      if (activeTask.columnId !== overTask.columnId) {
        newTasks[activeIndex] = {...activeTask, columnId: overTask.columnId}
      }

      const reorderedTasks = arrayMove(newTasks, activeIndex, overIndex)
      setLocalTasks(reorderedTasks)
      return;
    }

    // 🎯 Case 2: Task over column
    const isOverAColumn = over.data.current?.type === "Column"

    if (isActiveATask && isOverAColumn) {
      const activeTaskData = displayTasks[activeIndex]
      const targetColumnId = String(overId);

      if (activeTaskData.columnId !== targetColumnId) {
        const newTasks = [...displayTasks];
        newTasks[activeIndex] = {...activeTaskData, columnId: targetColumnId};
        setLocalTasks(newTasks)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // ✅ Reset activeTask hier
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

    updateTasksPositions({updates, optimisticTasks: localTasks})
  }

  return {
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    displayTasks,
    activeTask // ✅ Return activeTask voor DragOverlay
  }
}