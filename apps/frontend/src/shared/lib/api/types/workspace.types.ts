export interface WorkspaceDto {
  id: string;
  title: string;
  description?: string;
  color?: string;
  position: number;
  createdAt: string;
}

export interface CreateWorkspaceDto extends Record<string, unknown> {
  title: string;
  description?: string;
  color?: string;
}

export interface UpdateWorkspaceDto extends Record<string, unknown> {
  title: string;
  description?: string;
  color?: string;
  position: number;
}