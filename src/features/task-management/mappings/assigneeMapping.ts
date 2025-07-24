import { Tables } from "@/shared/types"
import { Assignee } from "@/features/task-management/types"

export function mapAssignee(row: Tables<"assignees">): Assignee {
  return {
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url
  }
}