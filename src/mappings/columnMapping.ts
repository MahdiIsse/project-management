import {Tables, Column} from "@/types"

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

