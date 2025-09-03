"use client";

import { Task } from "../../types";
import { TableRow, TableCell, Checkbox, Button } from "../../../../shared";
import {
  PrioritySelector,
  DueDatePicker,
  AssigneeSelector,
  TagSelector,
} from "../shared";
import { StatusSelector } from "./StatusSelector";
import { useUpdateTask } from "../../hooks";
import { useWorkspaceColumns } from "../../hooks";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

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
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";
  const { mutate: updateTask } = useUpdateTask(workspaceId);
  const { data: columns = [] } = useWorkspaceColumns(workspaceId);

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
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8">
            <StatusSelector
              currentColumnId={task.columnId}
              columns={columns}
              onStatusChange={(columnId) =>
                updateTask({
                  data: { columnId },
                  taskId: task.id,
                })
              }
            />
          </div>
          <Button
            variant="ghost"
            className="h-8 p-0 font-medium text-left hover:bg-muted/50 transition-colors flex-1 justify-start"
            onClick={() => onEdit(task)}
          >
            <span className="truncate block">{task.title}</span>
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 ">
          {task.createdAt ? (
            <>
              <CalendarIcon className="h-3 w-3" />
              <span>
                {format(new Date(task.createdAt), "d MMM", { locale: nl })}
              </span>
            </>
          ) : (
            "-"
          )}
        </div>
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
