"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Plus, Search, Check } from "lucide-react";
import type { Assignee } from "@/types";
import { useAssignees } from "@/hooks/assignee/useAssignees";
import {
  useTaskAssignees,
  useAddAssigneeToTask,
  useRemoveAssigneeFromTask,
} from "@/hooks/task/useTaskAssignees";

interface AssigneeSelectorProps {
  taskId: string;
  maxVisible?: number;
  variant?: "default" | "compact";
}

export function AssigneeSelector({
  taskId,
  maxVisible = 2,
  variant = "default",
}: AssigneeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Data hooks
  const { data: allAssigneesData, isLoading: isLoadingAll } = useAssignees();
  const { data: taskAssigneesData, isLoading: isLoadingTask } =
    useTaskAssignees(taskId);

  // Action hooks
  const { mutate: addAssignee, isPending: isAdding } = useAddAssigneeToTask();
  const { mutate: removeAssignee, isPending: isRemoving } =
    useRemoveAssigneeFromTask();

  // Computed values
  const taskAssignees = taskAssigneesData || [];
  const visibleAssignees = taskAssignees.slice(0, maxVisible);
  const remainingCount = taskAssignees.length - maxVisible;

  // Filter available assignees based on search
  const allAssignees = allAssigneesData || [];
  const filteredAssignees = allAssignees.filter((assignee) =>
    assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if assignee is currently assigned to task
  const isAssigned = (assigneeId: string) =>
    taskAssignees.some((assignee) => assignee.id === assigneeId);

  // Handle assignee toggle
  const handleAssigneeToggle = (assignee: Assignee) => {
    if (isAssigned(assignee.id)) {
      removeAssignee({ taskId, assigneeId: assignee.id });
    } else {
      addAssignee({ taskId, assigneeId: assignee.id });
    }
  };

  // Loading state for current assignees
  if (isLoadingTask) {
    return (
      <div className="flex -space-x-2">
        {Array.from({ length: maxVisible }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex -space-x-2 cursor-pointer group",
            variant === "compact" && "scale-90"
          )}
        >
          {/* Current Assignees */}
          {visibleAssignees.map((assignee) => (
            <Avatar
              key={assignee.id}
              className={cn(
                "h-8 w-8 border-2 border-background transition-transform hover:scale-110",
                variant === "compact" && "h-6 w-6"
              )}
            >
              <AvatarImage
                src={assignee.avatarUrl || undefined}
                alt={assignee.name}
              />
              <AvatarFallback className="text-xs font-medium">
                {assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}

          {/* Remaining Count */}
          {remainingCount > 0 && (
            <Avatar
              className={cn(
                "h-8 w-8 bg-muted border-2 border-background",
                variant === "compact" && "h-6 w-6"
              )}
            >
              <AvatarFallback className="text-xs font-medium text-muted-foreground">
                +{remainingCount}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Add Button (always visible) */}
          <Avatar
            className={cn(
              "h-8 w-8 border-2 border-dashed border-muted-foreground/30 bg-muted/50 hover:bg-muted transition-colors",
              "group-hover:border-primary/50 group-hover:bg-primary/5",
              variant === "compact" && "h-6 w-6"
            )}
          >
            <AvatarFallback>
              <Plus
                className={cn(
                  "h-4 w-4 text-muted-foreground group-hover:text-primary",
                  variant === "compact" && "h-3 w-3"
                )}
              />
            </AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Beheer Toegewezen Personen</h4>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek personen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Assignees List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoadingAll ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))
            ) : filteredAssignees.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {searchQuery
                  ? "Geen personen gevonden"
                  : "Geen personen beschikbaar"}
              </div>
            ) : (
              filteredAssignees.map((assignee) => {
                const assigned = isAssigned(assignee.id);

                return (
                  <div
                    key={assignee.id}
                    className={cn(
                      "flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors",
                      "hover:bg-muted/50",
                      assigned && "bg-muted"
                    )}
                    onClick={() => handleAssigneeToggle(assignee)}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={assigned}
                      disabled={isAdding || isRemoving}
                      className="pointer-events-none"
                    />

                    {/* Avatar */}
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={assignee.avatarUrl || undefined}
                        alt={assignee.name}
                      />
                      <AvatarFallback className="text-xs">
                        {assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <span className="flex-1 text-sm font-medium">
                      {assignee.name}
                    </span>

                    {/* Status indicator */}
                    {assigned && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {taskAssignees.length > 0 && (
            <div className="pt-2 border-t text-xs text-muted-foreground">
              {taskAssignees.length}{" "}
              {taskAssignees.length === 1 ? "persoon" : "personen"} toegewezen
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
