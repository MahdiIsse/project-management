import { Assignee, Tag, Priority } from "@/features/task-management/types";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: Priority
  position?: number
  columnId: string;
  workspaceId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  assignees: Assignee[];
  tags: Tag[];
};

export interface TaskFilters {
  assigneeIds?: string[];
  priorities?: Priority[];
  search?: string;
}