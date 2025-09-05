import { get, post, put, del, patch } from '../utils/http';
import type { 
  WorkspaceDto, 
  CreateWorkspaceDto, 
  UpdateWorkspaceDto 
} from '../types';

export const workspaceService = {
  async getWorkspaces(): Promise<WorkspaceDto[]> {
    return get<WorkspaceDto[]>("/api/workspace");
  },

  async getWorkspaceById(id: string): Promise<WorkspaceDto> {
    return get<WorkspaceDto>(`/api/workspace/${id}`);
  },

  async createWorkspace(data: CreateWorkspaceDto): Promise<WorkspaceDto> {
    return post<WorkspaceDto>("/api/workspace", data);
  },

  async updateWorkspace(id: string, data: UpdateWorkspaceDto): Promise<WorkspaceDto> {
    return put<WorkspaceDto>(`/api/workspace/${id}`, data);
  },

  async deleteWorkspace(id: string): Promise<void> {
    return del(`/api/workspace/${id}`);
  },

  async batchUpdateWorkspacePositions(
    updates: Array<{ id: string; position: number }>
  ): Promise<void> {
    return patch<void>(`/api/workspace/positions`, updates);
  }
};