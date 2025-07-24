import {
  isToday,
  isTomorrow,
  format,
  addDays,
  isBefore,
  startOfDay,
  isAfter,
} from "date-fns";
import { nl } from "date-fns/locale";

export const formatTaskDueDate = (dueDateString?: string): string => {
  if (!dueDateString) {
    return "";
  }

  const dueDate = new Date(dueDateString);
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(new Date(), 1));
  const sixDaysFromNow = startOfDay(addDays(new Date(), 6));

  if (isToday(dueDate)) {
    return "Vandaag";
  }

  if (isTomorrow(dueDate)) {
    return "Morgen";
  }

  if (isAfter(dueDate, tomorrow) && isBefore(dueDate, sixDaysFromNow)) {
    const diffDays =
      (Math.ceil(dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)).toFixed()

    return `Over ${diffDays} dagen`;
  }

  return format(dueDate, "d MMM", { locale: nl });
};
