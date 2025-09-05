'use client';

import { useState } from 'react';
import { Trash2, Ellipsis } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Task,
  TaskForm,
  useUpdateTask,
  useDeleteTask,
  PrioritySelector,
  DueDatePicker,
  AssigneeSelector,
  TagSelector,
} from '@/features/project-management';
import {
  cn,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: updateTask } = useUpdateTask(workspaceId);
  const { mutate: deleteTask, isPending: isDeleting } =
    useDeleteTask(workspaceId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'Task', columnId, index, task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const handleDeleteTask = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    deleteTask(task.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={cn(
        'relative transition-all duration-200 cursor-grab',
        'hover:scale-[1.02] hover:shadow-lg',
        isDragging && 'cursor-grabbing'
      )}
    >
      <div className="w-full bg-card text-card-foreground rounded-xl border shadow-sm p-6">
        <div className="mb-4">
          <div className="relative group flex items-start justify-between">
            <h3
              className="font-bold text-lg leading-none mb-2 pr-12 cursor-pointer hover:text-primary transition-colors"
              onClick={handleCardClick}
            >
              {task.title}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  data-dropdown-trigger
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out absolute top-0 right-0 h-8 w-8 text-destructive hover:text-destructive hover:scale-105"
                >
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleDeleteTask}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Taak verwijderen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {task.description && (
            <p className="text-muted-foreground text-sm">{task.description}</p>
          )}
        </div>

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

        <div className="border-t my-4" />

        <div className="flex justify-between items-center text-gray-500">
          <PrioritySelector
            currentPriority={task.priority}
            onPriorityChange={(priority) =>
              updateTask({
                data: { priority },
                taskId: task.id,
              })
            }
          />

          <DueDatePicker
            currentDate={task.dueDate}
            onDateChange={(date) =>
              updateTask({
                data: { dueDate: date },
                taskId: task.id,
              })
            }
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Taak Bewerken</DialogTitle>
            <DialogDescription>
              Bewerk de details van &quot;{task.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            workspaceId={workspaceId}
            taskToEdit={task}
            closeDialog={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Taak verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je &quot;{task.title}&quot; wilt verwijderen?
              Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTask}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
