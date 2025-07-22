import { Assignee, Tag, Priority } from "@/types";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: Priority
  columnId: string;
  workspaceId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  assignees: Assignee[];
  tags: Tag[];
};