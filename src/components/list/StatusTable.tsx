"use client";

import { useState } from "react";
import { Task, Column } from "@/types";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskForm } from "@/components/form/TaskForm";
import { TaskTableRow } from "./TaskTableRow";
import { StatusTableHeader } from "./StatusTableHeader";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface StatusTableProps {
  status: string;
  tasks: Task[];
  statusColor: string;
  onTaskSelect?: (taskIds: string[]) => void;
  selectedTasks?: string[];
  workspaceId: string;
  column: Column;
}

export function StatusTable({
  status,
  tasks,
  statusColor,
  onTaskSelect,
  selectedTasks = [],
  workspaceId,
  column,
}: StatusTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    const taskIds = tasks.map((task) => task.id);
    if (checked) {
      onTaskSelect?.([...selectedTasks, ...taskIds]);
    } else {
      onTaskSelect?.(selectedTasks.filter((id) => !taskIds.includes(id)));
    }
  };

  const handleTaskSelect = (taskId: string, checked: boolean) => {
    if (checked) {
      onTaskSelect?.([...selectedTasks, taskId]);
    } else {
      onTaskSelect?.(selectedTasks.filter((id) => id !== taskId));
    }
  };

  const handleTaskNameClick = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSuccess = () => {
    setIsTaskFormOpen(false);
    setTaskToEdit(null);
  };

  // Checkbox states
  const allTaskIds = tasks.map((task) => task.id);
  const selectedTaskIds = selectedTasks.filter((id) => allTaskIds.includes(id));
  const isAllSelected =
    tasks.length > 0 && selectedTaskIds.length === tasks.length;
  const isIndeterminate =
    selectedTaskIds.length > 0 && selectedTaskIds.length < tasks.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-6",
        isDragging && "opacity-50 scale-[0.98] shadow-lg z-50"
      )}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        {/* ✅ Vervangen door StatusTableHeader */}
        <StatusTableHeader
          column={column}
          status={status}
          statusColor={statusColor}
          taskCount={tasks.length}
          workspaceId={workspaceId}
          isExpanded={isExpanded}
          onExpandedChange={setIsExpanded}
          dragAttributes={attributes}
          dragListeners={listeners}
          isDragging={isDragging}
        />

        <CollapsibleContent>
          <div className="mt-2 border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                      />
                      {isIndeterminate && (
                        <span className="text-xs text-muted-foreground">
                          ({selectedTaskIds.length}/{tasks.length})
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-64">TASK</TableHead>
                  <TableHead className="w-32">CREATED</TableHead>
                  <TableHead className="w-40">DUE</TableHead>
                  <TableHead className="w-24">PRIORITY</TableHead>
                  <TableHead className="w-32">ASSIGNEE</TableHead>
                  <TableHead className="w-40">TAGS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TaskTableRow
                    key={task.id}
                    task={task}
                    workspaceId={workspaceId}
                    isSelected={selectedTasks.includes(task.id)}
                    onSelect={handleTaskSelect}
                    onEdit={handleTaskNameClick}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Task Form Dialog */}
      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          {taskToEdit && (
            <TaskForm
              workspaceId={workspaceId}
              taskToEdit={taskToEdit}
              closeDialog={handleTaskFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
