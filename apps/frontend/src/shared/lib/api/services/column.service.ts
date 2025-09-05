import { get, post, put, del, patch } from '../utils/http';
import type { ColumnDto, CreateColumnDto, UpdateColumnDto } from '../types';

export const columnService = {
  async getWorkspaceColumns(workspaceId: string): Promise<ColumnDto[]> {
    return get<ColumnDto[]>(`/api/workspaces/${workspaceId}/columns`);
  },

  async getColumnById(workspaceId: string, columnId: string): Promise<ColumnDto> {
    return get<ColumnDto>(`/api/workspaces/${workspaceId}/columns/${columnId}`);
  },

  async createColumn(workspaceId: string, data: CreateColumnDto): Promise<ColumnDto> {
    return post<ColumnDto>(`/api/workspaces/${workspaceId}/columns`, data);
  },

  async updateColumn(workspaceId: string, columnId: string, data: UpdateColumnDto): Promise<ColumnDto> {
    return put<ColumnDto>(`/api/workspaces/${workspaceId}/columns/${columnId}`, data);
  },

  async deleteColumn(workspaceId: string, columnId: string): Promise<void> {
    return del(`/api/workspaces/${workspaceId}/columns/${columnId}`);
  },

  async batchUpdateColumnPositions(
    workspaceId: string,
    updates: Array<{ id: string; position: number }>
  ): Promise<void> {
    return patch<void>(`/api/workspaces/${workspaceId}/columns/positions`, updates);
  }
};