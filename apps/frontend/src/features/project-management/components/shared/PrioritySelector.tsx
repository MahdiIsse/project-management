import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@/shared';
import { Priority, priorityOptions } from '@/features/project-management';
import { Flag } from 'lucide-react';

interface PrioritySelectorProps {
  currentPriority?: Priority;
  onPriorityChange: (priority: Priority) => void;
  variant?: 'default' | 'compact';
}

export function PrioritySelector({
  currentPriority,
  onPriorityChange,
  variant = 'default',
}: PrioritySelectorProps) {
  const priorityOption = priorityOptions.find(
    (p) => p.value === currentPriority
  );
  const priorityColor = priorityOption?.color || 'text-gray-500';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'flex items-center gap-1 cursor-pointer group hover:opacity-80 transition-all duration-200',
            'hover:bg-muted/50 rounded-md px-2 py-1 -mx-2 -my-1',
            variant === 'compact' && 'text-xs'
          )}
        >
          <Flag
            className={cn(
              'h-4 w-4 transition-transform group-hover:scale-110',
              priorityColor,
              variant === 'compact' && 'h-3 w-3'
            )}
          />
          <span className="text-sm transition-colors">
            {priorityOption?.label}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {priorityOptions.map((priority) => (
          <DropdownMenuItem
            key={priority.label}
            onSelect={() => onPriorityChange(priority.value)}
          >
            <Flag className={cn('h-4 w-4', priority.color)} />
            <span className="text-sm">{priority.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
