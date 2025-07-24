import { Tables } from "@/shared/types"
import { Column } from "@/features/task-management/types"

export function mapColumn(row: Tables<"columns">) : Column {
  return {
    id: row.id,
    title: row.title,
    position: row.position,
    workspaceId: row.workspace_id!,
    border: row.border,
    createdAt: row.created_at
  }
}

