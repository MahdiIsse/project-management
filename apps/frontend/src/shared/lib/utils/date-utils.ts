import {
  isToday,
  isTomorrow,
  format,
  addDays,
  isBefore,
  startOfDay,
  isAfter,
  isPast,
  parseISO,
  differenceInCalendarDays,
} from "date-fns";
import { nl } from "date-fns/locale";

export const parseDateStringAsLocal = (dateString: string): Date => {
  return parseISO(dateString);
};

export const formatTaskDueDate = (dueDateString?: string): string => {
  if (!dueDateString) {
    return "";
  }

  const dueDate = parseDateStringAsLocal(dueDateString);
  const today = startOfDay(new Date());
  const sixDaysFromNow = startOfDay(addDays(new Date(), 6));

  if (isToday(dueDate)) {
    return "Vandaag";
  }

  if (isTomorrow(dueDate)) {
    return "Morgen";
  }

  if (isAfter(dueDate, today) && isBefore(dueDate, sixDaysFromNow)) {
    const diffDays = differenceInCalendarDays(dueDate, today);

    return `Over ${diffDays} dagen`;
  }

  return format(dueDate, "d MMM", { locale: nl });
};

export const getDateColorClass = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "text-muted-foreground";

  const date = parseDateStringAsLocal(dateString);
  const today = startOfDay(new Date());
  const sixDaysFromNow = startOfDay(addDays(new Date(), 6));

  if (isPast(date) && !isToday(date)) {
    return "text-red-500 group-hover:text-red-600 font-medium";
  }

  if (isToday(date)) {
    return "text-amber-500 group-hover:text-amber-600 font-medium";
  }

  if (isAfter(date, today) && isBefore(date, sixDaysFromNow)) {
    return "text-emerald-500 group-hover:text-emerald-600";
  }

  return "text-foreground group-hover:text-foreground";
};