import { get, post, put, del, API_BASE_URL, getAuthToken } from '@/shared';
import type {
  AssigneeDto,
  CreateAssigneeDto,
  UpdateAssigneeDto,
} from '@/shared';

export const assigneeService = {
  async getAssignees(): Promise<AssigneeDto[]> {
    return get<AssigneeDto[]>('/api/assignee');
  },

  async getAssigneeById(assigneeId: string): Promise<AssigneeDto> {
    return get<AssigneeDto>(`/api/assignee/${assigneeId}`);
  },

  async createAssignee(data: CreateAssigneeDto): Promise<AssigneeDto> {
    return post<AssigneeDto>('/api/assignee', data);
  },

  async updateAssignee(
    assigneeId: string,
    data: UpdateAssigneeDto
  ): Promise<AssigneeDto> {
    return put<AssigneeDto>(`/api/assignee/${assigneeId}`, data);
  },

  async deleteAssignee(assigneeId: string): Promise<void> {
    return del(`/api/assignee/${assigneeId}`);
  },

  async createAssigneeWithFile(data: {
    name: string;
    avatarFile?: File;
  }): Promise<AssigneeDto> {
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
  },

  async updateAssigneeWithFile(
    assigneeId: string,
    data: { name: string; avatarFile?: File }
  ): Promise<AssigneeDto> {
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
  },
};
