export type Priority = "Low" | "Medium" | "High"

export const priorityOptions = [
  { value: "Low" as Priority, label: "Laag", color: "text-gray-500"},
  { value: "Medium" as Priority, label: "Gemiddeld", color: "text-yellow-500"},
  { value: "High" as Priority, label: "Hoog", color: "text-red-500"}
] as const

export function isValidPriority(value: string | null): value is Priority {
  return value === "Low" || value === "Medium" || value === "High"
}