"use client";

import { useState } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Checkbox,
} from "../../../../shared";
import { Flag } from "lucide-react";
import { priorityOptions } from "../../types";
import { cn } from "../../../../shared";

interface FilterPrioritySelectorProps {
  value: string[];
  onChange: (priorities: string[]) => void;
  placeholder?: string;
}

export function FilterPrioritySelector({
  value,
  onChange,
  placeholder = "Alle prioriteiten",
}: FilterPrioritySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (priority: string) => {
    const newValue = value.includes(priority)
      ? value.filter((p) => p !== priority)
      : [...value, priority];

    onChange(newValue);
  };

  const selectedLabels = priorityOptions
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <span className="text-sm">
                {selectedLabels.join(", ")} ({value.length})
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-2">
          <h4 className="font-medium text-sm mb-3">Selecteer prioriteiten</h4>

          {priorityOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                checked={value.includes(option.value)}
                className="pointer-events-none"
              />
              <Flag className={cn("h-4 w-4", option.color)} />
              <span className="flex-1 text-sm">{option.label}</span>
            </div>
          ))}

          {value.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([])}
              className="w-full mt-3"
            >
              Wis selectie
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
