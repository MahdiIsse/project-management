"use client";

import { Task } from "@/types";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PrioritySelector } from "@/components/shared/PrioritySelector";
import { DueDatePicker } from "@/components/shared/DueDatePicker";
import { AssigneeSelector } from "@/components/shared/AssigneeSelector";
import { TagSelector } from "@/components/shared/TagSelector";
import { useUpdateTask } from "@/hooks/task/useTasks";

interface TaskTableRowProps {
  task: Task;
  workspaceId: string;
  isSelected: boolean;
  onSelect: (taskId: string, checked: boolean) => void;
  onEdit: (task: Task) => void;
}

export function TaskTableRow({
  task,
  workspaceId,
  isSelected,
  onSelect,
  onEdit,
}: TaskTableRowProps) {
  const { mutate: updateTask } = useUpdateTask();

  return (
    <TableRow
      className={`hover:bg-muted/50 ${isSelected ? "bg-muted/30" : ""}`}
    >
      {/* Checkbox */}
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(task.id, checked as boolean)}
        />
      </TableCell>

      {/* Task Title */}
      <TableCell className="w-64">
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium text-left hover:bg-muted/50 transition-colors"
          onClick={() => onEdit(task)}
        >
          <span className="truncate block">{task.title}</span>
        </Button>
      </TableCell>

      {/* Created Date */}
      <TableCell className="w-32 text-sm">
        {new Date(task.createdAt || Date.now()).toLocaleDateString()}
      </TableCell>

      {/* Due Date - Inline Editor */}
      <TableCell className="w-40">
        <DueDatePicker
          currentDate={task.dueDate}
          onDateChange={(date) =>
            updateTask({
              data: { dueDate: date.toDateString() },
              taskId: task.id,
            })
          }
          variant="compact"
        />
      </TableCell>

      {/* Priority - Inline Editor */}
      <TableCell className="w-24">
        <PrioritySelector
          currentPriority={task.priority}
          onPriorityChange={(priority) =>
            updateTask({
              data: { priority },
              taskId: task.id,
            })
          }
          variant="compact"
        />
      </TableCell>

      {/* Assignees - Inline Editor */}
      <TableCell className="w-32">
        <AssigneeSelector taskId={task.id} maxVisible={2} variant="compact" />
      </TableCell>

      {/* Tags - Inline Editor */}
      <TableCell className="w-40">
        <TagSelector
          taskId={task.id}
          maxVisible={2}
          variant="default"
          showAddButton={true}
        />
      </TableCell>
    </TableRow>
  );
}
