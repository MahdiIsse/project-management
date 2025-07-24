import { Task, isValidPriority } from "@/features/task-management/types"
import { mapAssignee, mapTag } from "@/features/task-management/mappings"
import { Tables } from "@/shared";

export type TaskWithJoins = Tables<"tasks"> & {
  task_assignees?: {
    assignee: Tables<"assignees"> | null;
  }[];
  task_tags?: {
    tag: Tables<"tags"> | null;
  }[]
}

export function mapTask(row: TaskWithJoins): Task {
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
    assignees: (row.task_assignees || [])
      .map((ta) => ta.assignee)
      .filter((a): a is Tables<"assignees"> => !!a)
      .map(mapAssignee),
    tags: (row.task_tags || [])
      .map((tt) => tt.tag)
      .filter((t): t is Tables<"tags"> => !!t)
      .map(mapTag),
  };
}

