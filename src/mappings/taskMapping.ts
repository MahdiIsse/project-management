import {Tables, Task, isValidPriority} from "@/types"
import {mapAssignee, mapTag} from "@/mappings"

export function mapTask(row: Tables<"tasks"> & {
  assignees?: Tables<"assignees">[];
  tags?: Tables<"tags">[];
}) : Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    priority: isValidPriority(row.priority) ? row.priority : undefined,
    position: row.position,
    columnId: row.column_id!,
    workspaceId: row.workspace_id!,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assignees: (row.assignees || []).map(mapAssignee),
    tags: (row.tags || []).map(mapTag)
  }
}

