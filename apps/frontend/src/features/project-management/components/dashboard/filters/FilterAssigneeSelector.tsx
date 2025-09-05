'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Checkbox,
  Button,
} from '@/shared';
import { Search, Users } from 'lucide-react';
import { useAssignees } from '@/features/project-management';

interface FilterAssigneeSelectorProps {
  value: string[];
  onChange: (assigneeIds: string[]) => void;
  placeholder?: string;
}

export function FilterAssigneeSelector({
  value,
  onChange,
  placeholder = 'Alle assignees',
}: FilterAssigneeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: allAssignees = [] } = useAssignees();

  const filteredAssignees = allAssignees.filter((assignee) =>
    assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAssignees = allAssignees.filter((assignee) =>
    value.includes(assignee.id)
  );

  const handleToggle = (assigneeId: string) => {
    const newValue = value.includes(assigneeId)
      ? value.filter((id) => id !== assigneeId)
      : [...value, assigneeId];

    onChange(newValue);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {selectedAssignees.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  {selectedAssignees.length} geselecteerd
                </span>
                <div className="flex -space-x-1 ml-2">
                  {selectedAssignees.slice(0, 3).map((assignee) => (
                    <Avatar key={assignee.id} className="h-5 w-5 border">
                      <AvatarImage src={assignee.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {assignee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {selectedAssignees.length > 3 && (
                    <div className="h-5 w-5 rounded-full bg-muted border text-xs flex items-center justify-center">
                      +{selectedAssignees.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Zoek assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {filteredAssignees.map((assignee) => (
              <div
                key={assignee.id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleToggle(assignee.id)}
              >
                <Checkbox
                  checked={value.includes(assignee.id)}
                  className="pointer-events-none"
                />
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assignee.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm">{assignee.name}</span>
              </div>
            ))}
          </div>
          {value.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([])}
              className="w-full"
            >
              Wis selectie
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
