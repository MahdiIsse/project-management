import { get, post, put, del, patch } from '../utils/http';
import type { 
  ProjectTaskDto, 
  CreateProjectTaskDto, 
  UpdateProjectTaskDto 
} from '../types';

export const taskService = {
  async getWorkspaceTasks(workspaceId: string): Promise<ProjectTaskDto[]> {
    return get<ProjectTaskDto[]>(`/api/workspaces/${workspaceId}/tasks`);
  },

  async getTaskById(workspaceId: string, taskId: string): Promise<ProjectTaskDto> {
    return get<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}`);
  },

  async createTask(
    workspaceId: string, 
    columnId: string, 
    data: CreateProjectTaskDto
  ): Promise<ProjectTaskDto> {
    return post<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks?columnId=${columnId}`, data);
  },

  async updateTask(
    workspaceId: string, 
    taskId: string, 
    data: UpdateProjectTaskDto
  ): Promise<ProjectTaskDto> {
    return put<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}`, data);
  },

  async deleteTask(workspaceId: string, taskId: string): Promise<void> {
    return del(`/api/workspaces/${workspaceId}/tasks/${taskId}`);
  },

  async addAssigneeToTask(
    workspaceId: string, 
    taskId: string, 
    assigneeId: string
  ): Promise<ProjectTaskDto> {
    return post<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/assignees/${assigneeId}`, {});
  },

  async removeAssigneeFromTask(
    workspaceId: string, 
    taskId: string, 
    assigneeId: string
  ): Promise<ProjectTaskDto> {
    return del<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/assignees/${assigneeId}`);
  },

  async addTagToTask(
    workspaceId: string, 
    taskId: string, 
    tagId: string
  ): Promise<ProjectTaskDto> {
    return post<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/tags/${tagId}`, {});
  },

  async removeTagFromTask(
    workspaceId: string, 
    taskId: string, 
    tagId: string
  ): Promise<ProjectTaskDto> {
    return del<ProjectTaskDto>(`/api/workspaces/${workspaceId}/tasks/${taskId}/tags/${tagId}`);
  },

  async batchUpdateTaskPositions(
    workspaceId: string,
    updates: Array<{ id: string; position: number; columnId: string }>
  ): Promise<void> {
    return patch<void>(`/api/workspaces/${workspaceId}/tasks/positions`, updates);
  }
};