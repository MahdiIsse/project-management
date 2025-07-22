import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatTaskDueDate } from "@/lib/date-utils";
import { isPast, isToday } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";

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
  const isOverdue =
    currentDate &&
    isPast(new Date(currentDate)) &&
    !isToday(new Date(currentDate));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-1 cursor-pointer",
            variant === "compact" && "text-xs"
          )}
        >
          <CalendarDays className="h-4 w-4" />
          <span
            className={cn("text-sm", {
              "text-red-500": isOverdue,
              "text-orange-500": currentDate && isToday(new Date(currentDate)),
            })}
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
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
