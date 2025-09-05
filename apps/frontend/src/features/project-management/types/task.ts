import { Assignee, Tag, Priority } from ".";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority; 
  position: number;
  columnId: string;
  workspaceId: string;
  createdAt?: string;
  updatedAt?: string;
  assignees: Assignee[];
  tags: Tag[];
};

export interface CreateTaskInput {
  columnId: string;
  data: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: Priority; 
    assigneeIds?: string[];
    tagIds?: string[];
  };
}

export interface UpdateTaskInput {
  taskId: string;
  data: {
    title?: string;
    description?: string;
    dueDate?: string | undefined;
    priority?: Priority; 
    columnId?: string;
    position?: number;
    assigneeIds?: string[];
    tagIds?: string[];
  };
}

export type TaskFilterParams = {
  search?: string;
  assigneeIds?: string[];
  priorities?: Priority[]; 
};