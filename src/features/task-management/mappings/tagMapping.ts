import { Tables } from "@/shared/types"
import { Tag } from "@/features/task-management/types"

export function mapTag(row: Tables<"tags">): Tag {
  return {
    id: row.id,
    name: row.name,
    colorName: row.color_name,
    createdAt: row.created_at,
    ownerId: row.owner_id,
  }
}