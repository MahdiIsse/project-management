"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Checkbox,
  Skeleton,
  Button,
  FormLabel,
} from "@/shared";
import { Search, Check, UserPlus } from "lucide-react";

import { useAssignees } from "@/features/task-management/hooks";

interface AssigneeFormSelectorProps {
  value: string[];
  onChange: (assigneeIds: string[]) => void;
}

export function AssigneeFormSelector({
  value,
  onChange,
}: AssigneeFormSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: assignees, isLoading } = useAssignees();

  const filteredAssignees =
    assignees?.filter((assignee) =>
      assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const selectedAssignees =
    assignees?.filter((assignee) => value.includes(assignee.id)) || [];

  const handleToggleAssignee = (assigneeId: string) => {
    const newValue = value.includes(assigneeId)
      ? value.filter((id) => id !== assigneeId)
      : [...value, assigneeId];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <FormLabel className="text-sm font-medium">Toegewezen aan</FormLabel>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-auto min-h-[40px] p-2"
          >
            {selectedAssignees.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedAssignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center gap-1 bg-muted rounded px-2 py-1 text-xs"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={assignee.avatarUrl || ""} />
                      <AvatarFallback className="text-xs">
                        {assignee.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{assignee.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserPlus className="h-4 w-4" />
                <span>Selecteer team members...</span>
              </div>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            ) : filteredAssignees.length > 0 ? (
              <div className="p-1">
                {filteredAssignees.map((assignee) => {
                  const isSelected = value.includes(assignee.id);
                  return (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => handleToggleAssignee(assignee.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assignee.avatarUrl || ""} />
                        <AvatarFallback>
                          {assignee.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {assignee.name}
                        </p>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <UserPlus className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Geen team members gevonden</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
