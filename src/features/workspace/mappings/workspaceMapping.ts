import { Workspace} from "@/features/workspace/types"
import { Tables } from "@/shared/types"

export function mapWorkspace(row: Tables<"workspaces">) : Workspace {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    color: row.color,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ownerId: row.owner_id
  }
}

