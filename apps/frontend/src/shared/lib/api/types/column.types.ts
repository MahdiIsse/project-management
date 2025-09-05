export interface ColumnDto {
  id: string;
  title: string;
  color?: string;
  position: number;
  createdAt: string;
  workspaceId: string;
}

export interface CreateColumnDto extends Record<string, unknown> {
  title: string;
  color?: string;
}

export interface UpdateColumnDto extends Record<string, unknown> {
  title: string;
  color?: string;
  position: number;
}