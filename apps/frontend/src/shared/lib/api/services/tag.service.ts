import { get, post, put, del } from '../utils/http';
import type { TagDto, CreateTagDto, UpdateTagDto } from '../types';

export const tagService = {
  async getTags(): Promise<TagDto[]> {
    return get<TagDto[]>("/api/tag");
  },

  async getTagById(tagId: string): Promise<TagDto> {
    return get<TagDto>(`/api/tag/${tagId}`);
  },

  async createTag(data: CreateTagDto): Promise<TagDto> {
    return post<TagDto>("/api/tag", data);
  },

  async updateTag(tagId: string, data: UpdateTagDto): Promise<TagDto> {
    return put<TagDto>(`/api/tag/${tagId}`, data);
  },

  async deleteTag(tagId: string): Promise<void> {
    return del(`/api/tag/${tagId}`);
  }
};