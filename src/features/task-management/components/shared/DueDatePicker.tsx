"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "@/shared";
import { formatTaskDueDate, getDateColorClass } from "@/shared";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared";
import { Calendar } from "@/shared";

interface DueDatePickerProps {
  currentDate?: string | null;
  onDateChange: (date: Date) => void;
  variant?: "default" | "compact";
}

export function DueDatePicker({
  currentDate,
  onDateChange,
  variant = "default",
}: DueDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-1 cursor-pointer group transition-all duration-200",
            "hover:bg-muted/80 hover:shadow-sm rounded-md px-2 py-1 -mx-2 -my-1",
            variant === "compact" && "text-xs"
          )}
        >
          <CalendarDays
            className={cn(
              "h-4 w-4 transition-transform group-hover:scale-110",
              variant === "compact" && "h-3 w-3"
            )}
          />
          <span
            className={cn(
              "text-sm transition-all duration-200 group-hover:scale-[1.02]",
              getDateColorClass(currentDate)
            )}
          >
            {currentDate ? formatTaskDueDate(currentDate) : "Geen datum"}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={currentDate ? new Date(currentDate) : undefined}
          onSelect={(date) => {
            if (date) {
              onDateChange(date);
              setIsOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
