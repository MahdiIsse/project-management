export interface TagDto {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTagDto extends Record<string, unknown> {
  name: string;
  color: string;
}

export interface UpdateTagDto extends Record<string, unknown> {
  name: string;
  color: string;
}