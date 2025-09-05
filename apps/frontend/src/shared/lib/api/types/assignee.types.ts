export interface AssigneeDto {
  id: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAssigneeDto extends Record<string, unknown> {
  name: string;
  avatarUrl?: string;
}

export interface UpdateAssigneeDto extends Record<string, unknown> {
  name: string;
  avatarUrl?: string;
}