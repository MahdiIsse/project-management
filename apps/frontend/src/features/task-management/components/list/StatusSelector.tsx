import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../shared";
import { cn } from "../../../../shared";
import { Column } from "../../types";
import { getColumnColorByBorder } from "../../utils";
import { Circle } from "lucide-react";

interface StatusSelectorProps {
  currentColumnId: string;
  columns: Column[];
  onStatusChange: (columnId: string) => void;
}

export function StatusSelector({
  currentColumnId,
  columns,
  onStatusChange,
}: StatusSelectorProps) {
  const currentColumn = columns.find((col) => col.id === currentColumnId);
  const currentColumnColor = getColumnColorByBorder(currentColumn?.color);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "flex items-center justify-center cursor-pointer group hover:opacity-80 transition-all duration-200",
            "hover:bg-muted/50 rounded-full w-6 h-6"
          )}
        >
          <Circle
            className={cn(
              "h-4 w-4 transition-transform group-hover:scale-110",
              currentColumnColor.columnText
            )}
            strokeWidth={2.5}
            fill="none"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {columns.map((column) => {
          const columnColor = getColumnColorByBorder(column.color);
          const isActive = column.id === currentColumnId;

          return (
            <DropdownMenuItem
              key={column.id}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isActive && "bg-muted"
              )}
              onClick={() => onStatusChange(column.id)}
            >
              <Circle
                className={cn("h-3 w-3", columnColor.columnText)}
                strokeWidth={2.5}
                fill="none"
              />
              <span className="flex-1">{column.title}</span>
              {isActive && (
                <span className="text-xs text-muted-foreground">Huidig</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
