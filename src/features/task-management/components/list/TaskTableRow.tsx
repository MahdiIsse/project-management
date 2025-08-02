"use client";

import { Task } from "@/features/task-management/types";
import { TableRow, TableCell, Checkbox, Button } from "@/shared";
import {
  PrioritySelector,
  DueDatePicker,
  AssigneeSelector,
  TagSelector,
} from "@/features/task-management/components/shared";
import { useUpdateTask } from "@/features/task-management/hooks";

interface TaskTableRowProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string, checked: boolean) => void;
  onEdit: (task: Task) => void;
}

export function TaskTableRow({
  task,
  isSelected,
  onSelect,
  onEdit,
}: TaskTableRowProps) {
  const { mutate: updateTask } = useUpdateTask();

  return (
    <TableRow
      className={`hover:bg-muted/50 ${isSelected ? "bg-muted/30" : ""}`}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(task.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium text-left hover:bg-muted/50 transition-colors"
          onClick={() => onEdit(task)}
        >
          <span className="truncate block">{task.title}</span>
        </Button>
      </TableCell>
      <TableCell className="text-sm">
        {new Date(task.createdAt || Date.now()).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <DueDatePicker
          currentDate={task.dueDate}
          onDateChange={(date) =>
            updateTask({
              data: { dueDate: date },
              taskId: task.id,
            })
          }
          variant="compact"
        />
      </TableCell>
      <TableCell>
        <PrioritySelector
          currentPriority={task.priority}
          onPriorityChange={(priority) =>
            updateTask({
              data: { priority },
              taskId: task.id,
            })
          }
          variant="default"
        />
      </TableCell>
      <TableCell>
        <AssigneeSelector
          taskId={task.id}
          maxVisible={2}
          variant="default"
          assignees={task.assignees}
        />
      </TableCell>
      <TableCell>
        <TagSelector
          taskId={task.id}
          maxVisible={2}
          variant="default"
          showAddButton={true}
          tags={task.tags}
        />
      </TableCell>
    </TableRow>
  );
}
