import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Priority, priorityOptions } from "@/types";
import { Flag } from "lucide-react";

interface PrioritySelectorProps {
  currentPriority?: Priority;
  onPriorityChange: (priority: Priority) => void;
  variant?: "default" | "compact";
}

export function PrioritySelector({
  currentPriority,
  onPriorityChange,
  variant = "default",
}: PrioritySelectorProps) {
  const priorityOption = priorityOptions.find(
    (p) => p.value === currentPriority
  );
  const priorityColor = priorityOption?.color || "text-gray-500";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-1 cursor-pointer",
            variant === "compact" && "text-xs"
          )}
        >
          <Flag className={cn("h-4 w-4", priorityColor)} />
          <span className="text-sm">{priorityOption?.label}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {priorityOptions.map((priority) => (
          <DropdownMenuItem
            key={priority.label}
            onSelect={() => onPriorityChange(priority.value)}
          >
            <Flag className={cn("h-4 w-4", priority.color)} />
            <span className="text-sm">{priority.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
