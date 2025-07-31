import {
  isToday,
  isTomorrow,
  format,
  addDays,
  isBefore,
  startOfDay,
  isAfter,
  isPast,
} from "date-fns";
import { nl } from "date-fns/locale";

export const formatTaskDueDate = (dueDateString?: string): string => {
  if (!dueDateString) {
    return "";
  }

  const dueDate = new Date(dueDateString);
  const today = startOfDay(new Date());
  const sixDaysFromNow = startOfDay(addDays(new Date(), 6));

  if (isToday(dueDate)) {
    return "Vandaag";
  }

  if (isTomorrow(dueDate)) {
    return "Morgen";
  }

  if (isAfter(dueDate, today) && isBefore(dueDate, sixDaysFromNow)) {
    const diffDays =
      (Math.ceil(dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)).toFixed()

    return `Over ${diffDays} dagen`;
  }

  return format(dueDate, "d MMM", { locale: nl });
};

/**
 * Returns appropriate color classes for due dates based on urgency
 */
export const getDateColorClass = (dateString: string | null | undefined): string => {
  if (!dateString) return "text-muted-foreground";
  
  const date = new Date(dateString);
  const today = startOfDay(new Date());
  const sixDaysFromNow = startOfDay(addDays(new Date(), 6));
  
  // Overdue - Red (urgent)
  if (isPast(date) && !isToday(date)) {
    return "text-red-500 group-hover:text-red-600 font-medium";
  }
  
  // Today - Amber (important but warm)
  if (isToday(date)) {
    return "text-amber-500 group-hover:text-amber-600 font-medium";
  }
  

  
  // Within week (2-6 days) - Green (on track, positive)
  if (isAfter(date, today) && isBefore(date, sixDaysFromNow)) {
    return "text-emerald-500 group-hover:text-emerald-600";
  }
  
  // Future - Default
  return "text-foreground group-hover:text-foreground";
};

/**
 * Formats a Date object for database storage (date-only, no timezone issues)
 * Ensures the date stays the same regardless of timezone
 */
export const formatDateForDatabase = (date: Date): string => {
  // Get date components in local timezone to avoid UTC conversion issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Ensures a date is at start of day in local timezone
 * Useful when you want to work with dates only (no time)
 */
export const toStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};