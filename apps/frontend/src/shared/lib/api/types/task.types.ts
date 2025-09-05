import { AssigneeDto, TagDto } from ".";

export interface ProjectTaskDto {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: number;
  position: number;
  createdAt: string;
  updatedAt?: string;
  columnId: string;
  workspaceId: string;
  assignees: AssigneeDto[];
  tags: TagDto[];
}

export interface CreateProjectTaskDto extends Record<string, unknown> {
  title: string;
  description?: string;
  dueDate?: string;
  priority: number;
}

export interface UpdateProjectTaskDto extends Record<string, unknown> {
  title: string;
  description?: string;
  dueDate?: string;
  priority: number;
  position: number;
}