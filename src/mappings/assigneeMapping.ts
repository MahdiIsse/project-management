import {Tables, Assignee} from "@/types"

export function mapAssignee(row: Tables<"assignees">): Assignee {
  return {
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url
  }
}