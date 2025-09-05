export type Priority = "Low" | "Medium" | "High"

export const priorityOptions = [
  { value: "Low" as Priority, label: "Laag", color: "text-blue-500"},
  { value: "Medium" as Priority, label: "Gemiddeld", color: "text-yellow-500"},
  { value: "High" as Priority, label: "Hoog", color: "text-red-500"}
] as const

export function isValidPriority(value: string | null): value is Priority {
  return value === "Low" || value === "Medium" || value === "High"
}

export const priorityToBackend = {
  "Low": 1,
  "Medium": 2, 
  "High": 3
} as const

export const priorityFromBackend = {
  1: "Low" as Priority,
  2: "Medium" as Priority,
  3: "High" as Priority
} as const

export function convertPriorityToBackend(priority: Priority): number {
  return priorityToBackend[priority]
}

export function convertPriorityFromBackend(priority: number): Priority {
  return priorityFromBackend[priority as keyof typeof priorityFromBackend] || "Low"
}

export function safeConvertPriorityFromBackend(priority: number | undefined): Priority {
  if (!priority || !(priority in priorityFromBackend)) return "Low"
  return priorityFromBackend[priority as keyof typeof priorityFromBackend]
}