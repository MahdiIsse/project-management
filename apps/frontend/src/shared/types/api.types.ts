export interface LoginRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
}

export interface RegisterRequest extends Record<string, unknown> {
  email: string;
  password: string;
  fullName: string;
  avatarFile?: File;
}

export interface RegisterResponse {
  token: string;
  expiresAtUtc: string;
  onboardingCompleted: boolean;
  onboardingError?: string;
  message: string;
}

export interface ApiRequestData {
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AssigneeRequest {
  name: string;
  avatarFile?: File;
}

export interface AssigneeResponse {
  id: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  ownerId: string;
}

export interface TaskRequest extends Record<string, unknown> {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

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

export interface UserDto {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt?: string;
  roles?: string[];
}