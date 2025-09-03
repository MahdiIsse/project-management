import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RegisterResponse,
  UploadResponse, 
  WorkspaceDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  ColumnDto,
  CreateColumnDto, 
  UpdateColumnDto,
  ProjectTaskDto,
  CreateProjectTaskDto, 
  UpdateProjectTaskDto,
  CreateTagDto, 
  UpdateTagDto,
  CreateAssigneeDto,
  UpdateAssigneeDto,
  TagDto,
  AssigneeDto,
  UserDto
} from '../../types';

const API_BASE_URL = "https://projectmanagement-mi.azurewebsites.net";

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
    
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  }
}

function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = await getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && {Authorization: `Bearer ${token}`}),
    ...options.headers,
  };

  const requestConfig: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, requestConfig);

    if (!response.ok) {
      if (response.status === 401) {
        
        removeAuthToken();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        throw new Error('Session expired. Please log in again.');
      }

      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      return {} as T;
    }
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

export async function get<T>(endpoint:string): Promise<T> {
  return makeRequest<T>(endpoint, {method: "GET"});
}

export async function post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function patch<T>(endpoint: string, data: Record<string, unknown> | unknown[]): Promise<T> {  return makeRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function del(endpoint: string): Promise<void> {
  return makeRequest<void>(endpoint, { method: 'DELETE' });
}

export async function uploadFile(endpoint: string, file: File): Promise<UploadResponse> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      ...(token && {Authorization: `Bearer ${token}`}),
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  return response.json();
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>("/api/auth/login", credentials);
}

export async function registerWithFile(data: RegisterRequest): Promise<RegisterResponse> {
  const url = `${API_BASE_URL}/api/auth/register`;
  const token = await getAuthToken();
  
  const formData = new FormData();
  formData.append('Email', data.email);
  formData.append('Password', data.password);
  formData.append('FullName', data.fullName);
  
  if (data.avatarFile) {
    formData.append('AvatarFile', data.avatarFile);
  }

  const headers: HeadersInit = {
    
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.token) {
    setAuthToken(result.token);
  }
  
  return result;
}

export async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>("/api/auth/register", credentials);
}

export function logout() {
  removeAuthToken();
  
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}



export async function getWorkspaces(): Promise<WorkspaceDto[]> {
  return get<WorkspaceDto[]>("/api/workspace");
}

export async function getWorkspaceById(id: string): Promise<WorkspaceDto> {
  return get<WorkspaceDto>(`/api/workspace/${id}`);
}

export async function createWorkspace(data: CreateWorkspaceDto): Promise<WorkspaceDto> {
  return post<WorkspaceDto>("/api/workspace", data);
}

export async function updateWorkspace(id: string, data: UpdateWorkspaceDto): Promise<WorkspaceDto> {
  return put<WorkspaceDto>(`/api/workspace/${id}`, data);
}

export async function deleteWorkspace(id: string): Promise<void> {
  return del(`/api/workspace/${id}`);
}

export async function getWorkspaceColumns(workspaceId: string): Promise<ColumnDto[]> {
  return get<ColumnDto[]>(`/api/workspaces/${workspaceId}/columns`);
}

export async function getColumnById(workspaceId: string, columnId: string): Promise<ColumnDto> {
  return get<ColumnDto>(`/api/workspaces/${workspaceId}/columns/${columnId}`);
}

export async function createColumn(workspaceId: string, data: CreateColumnDto): Promise<ColumnDto> {
  return post<ColumnDto>(`/api/workspaces/${workspaceId}/columns`, data);
}

export async function updateColumn(workspaceId: string, columnId: string, data: UpdateColumnDto): Promise<ColumnDto> {
  return put<ColumnDto>(`/api/workspaces/${workspaceId}/columns/${columnId}`, data);
}

export async function deleteColumn(workspaceId: string, columnId: string): Promise<void> {
  return del(`/api/workspaces/${workspaceId}/columns/${columnId}`);
}

export async function getWorkspaceTasks(workspaceId: string): Promise<ProjectTaskDto[]> {
  return get<ProjectTaskDto[]>(`/api/workspaces/${workspaceId}/tasks`);
}

export async function getTaskById(workspaceId: string, taskId: string): Promise<ProjectTaskDto> {
  return get<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}`);
}

export async function createTask(
  workspaceId: string, 
  columnId: string, 
  data: CreateProjectTaskDto
): Promise<ProjectTaskDto> {
  
  return post<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks?columnId=${columnId}`, data);
}

export async function updateTask(
  workspaceId: string, 
  taskId: string, 
  data: UpdateProjectTaskDto
): Promise<ProjectTaskDto> {
  
  return put<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}`, data);
}

export async function deleteTask(workspaceId: string, taskId: string): Promise<void> {
  return del(`/api/workspaces/${workspaceId}/tasks/${taskId}`);
}

export async function addAssigneeToTask(
  workspaceId: string, 
  taskId: string, 
  assigneeId: string
): Promise<ProjectTaskDto> {
  return post<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/assignees/${assigneeId}`, {});
}

export async function removeAssigneeFromTask(
  workspaceId: string, 
  taskId: string, 
  assigneeId: string
): Promise<ProjectTaskDto> {
  return makeRequest<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/assignees/${assigneeId}`, {
    method: "DELETE",
  });
}

export async function addTagToTask(
  workspaceId: string, 
  taskId: string, 
  tagId: string
): Promise<ProjectTaskDto> {
  return post<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/tags/${tagId}`, {});
}

export async function removeTagFromTask(
  workspaceId: string, 
  taskId: string, 
  tagId: string
): Promise<ProjectTaskDto> {
  return makeRequest<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/tags/${tagId}`, {
    method: "DELETE",
  });
}

export async function getTags(): Promise<TagDto[]> {
  return get<TagDto[]>("/api/tag");
}

export async function getTagById(tagId: string): Promise<TagDto> {
  return get<TagDto>(`/api/tag/${tagId}`);
}

export async function createTag(data: CreateTagDto): Promise<TagDto> {
  return post<TagDto>("/api/tag", data);
}

export async function updateTag(tagId: string, data: UpdateTagDto): Promise<TagDto> {
  return put<TagDto>(`/api/tag/${tagId}`, data);
}

export async function deleteTag(tagId: string): Promise<void> {
  return del(`/api/tag/${tagId}`);
}

export async function getAssignees(): Promise<AssigneeDto[]> {
  return get<AssigneeDto[]>("/api/assignee");
}

export async function getAssigneeById(assigneeId: string): Promise<AssigneeDto> {
  return get<AssigneeDto>(`/api/assignee/${assigneeId}`);
}

export async function createAssignee(data: CreateAssigneeDto): Promise<AssigneeDto> {
  return post<AssigneeDto>("/api/assignee", data);
}

export async function updateAssignee(assigneeId: string, data: UpdateAssigneeDto): Promise<AssigneeDto> {
  return put<AssigneeDto>(`/api/assignee/${assigneeId}`, data);
}

export async function deleteAssignee(assigneeId: string): Promise<void> {
  return del(`/api/assignee/${assigneeId}`);
}

export async function getCurrentUser(): Promise<UserDto> {
  return get<UserDto>("/api/auth/me");
}



export async function createAssigneeWithFile(data: { name: string; avatarFile?: File }): Promise<AssigneeDto> {
  const url = `${API_BASE_URL}/api/assignee`;
  const token = await getAuthToken();
  
  const formData = new FormData();
  formData.append('name', data.name);
  
  if (data.avatarFile) {
    formData.append('avatarFile', data.avatarFile);
  }

  const headers: HeadersInit = {
    
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Assignee creation failed: ${response.statusText}`);
  }

  return response.json();
}

export async function updateAssigneeWithFile(assigneeId: string, data: { name: string; avatarFile?: File }): Promise<AssigneeDto> {
  const url = `${API_BASE_URL}/api/assignee/${assigneeId}`;
  const token = await getAuthToken();
  
  const formData = new FormData();
  formData.append('name', data.name);
  
  if (data.avatarFile) {
    formData.append('avatarFile', data.avatarFile);
  }

  const headers: HeadersInit = {
    
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Assignee update failed: ${response.statusText}`);
  }

  return response.json();
}

export async function batchUpdateColumnPositions(
  workspaceId: string,
  updates: Array<{ id: string; position: number }>
): Promise<void> {
  return patch<void>(`/api/workspaces/${workspaceId}/columns/positions`, updates);
}

export async function batchUpdateWorkspacePositions(
  updates: Array<{ id: string; position: number }>
): Promise<void> {
  return patch<void>(`/api/workspace/positions`, updates);
}

export async function batchUpdateTaskPositions(
  workspaceId: string,
  updates: Array<{ id: string; position: number; columnId: string }>
): Promise<void> {
  return patch<void>(`/api/workspaces/${workspaceId}/tasks/positions`, updates);
}

export const apiClient = {
  get,
  post,
  put,
  patch,
  del,

  uploadFile,

  login,
  register,
  registerWithFile,
  logout,

  getCurrentUser,

  
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  batchUpdateWorkspacePositions,

  
  getWorkspaceColumns,
  getColumnById,
  createColumn,
  updateColumn,
  deleteColumn,
  batchUpdateColumnPositions,

  
  getWorkspaceTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addAssigneeToTask,
  removeAssigneeFromTask,
  addTagToTask,
  removeTagFromTask,
  batchUpdateTaskPositions,

  
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,

  
  getAssignees,
  getAssigneeById,
  createAssignee,
  createAssigneeWithFile,
  updateAssignee,
  updateAssigneeWithFile,
  deleteAssignee,

  setAuthToken,
  removeAuthToken,
};