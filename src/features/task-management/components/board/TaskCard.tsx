"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task } from "@/features/task-management";
import { cn, Button, Dialog, DialogTrigger, DialogContent } from "@/shared";
import { TaskForm } from "@/features/task-management";
import { useUpdateTask } from "@/features/task-management";
import {
  PrioritySelector,
  DueDatePicker,
  AssigneeSelector,
  TagSelector,
} from "@/features/task-management";

interface TaskCardProps {
  task: Task;
  workspaceId: string;
  columnId: string;
  index: number;
}

export function TaskCard({
  task,
  workspaceId,
  columnId,
  index,
}: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: updateTask } = useUpdateTask();

  // ✅ useSortable hook van SortableTaskCard
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", columnId, index, task },
  });

  // ✅ Styling van SortableTaskCard
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // Volledig transparant tijdens drag (DragOverlay toont preview)
    zIndex: isDragging ? 50 : 1,
  };

  return (
    // ✅ Wrapper div met dnd-kit properties
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={cn(
        "relative transition-all duration-200 cursor-grab",
        "hover:scale-[1.02] hover:shadow-lg", // ✅ Subtle hover effect
        isDragging && "cursor-grabbing"
      )}
    >
      {/* ✅ Bestaande TaskCard content blijft hetzelfde */}
      <div className="w-full bg-card text-card-foreground rounded-xl border shadow-sm p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="relative group flex items-start justify-between">
            <h3 className="font-bold text-lg leading-none mb-2 pr-12">
              {task.title}
            </h3>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out absolute top-0 right-0 h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary hover:scale-105"
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <TaskForm
                  workspaceId={workspaceId}
                  taskToEdit={task}
                  closeDialog={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          {task.description && (
            <p className="text-muted-foreground text-sm">{task.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <TagSelector
              taskId={task.id}
              maxVisible={2}
              variant="default"
              showAddButton={true}
              tags={task.tags}
              layout="stacked"
            />
          </div>

          <div className="flex-shrink-0">
            <AssigneeSelector
              taskId={task.id}
              maxVisible={2}
              variant="default"
              assignees={task.assignees}
            />
          </div>
        </div>

        {/* Separator */}
        <div className="border-t my-4" />

        {/* Footer */}
        <div className="flex justify-between items-center text-gray-500">
          <PrioritySelector
            currentPriority={task.priority}
            onPriorityChange={(priority) =>
              updateTask({ data: { priority }, taskId: task.id })
            }
          />

          <DueDatePicker
            currentDate={task.dueDate}
            onDateChange={(date) =>
              updateTask({
                data: { dueDate: date.toDateString() },
                taskId: task.id,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
