import { get, post } from '../utils/http';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  UserDto 
} from '../types';
import { getAuthToken, setAuthToken, removeAuthToken } from "../utils/http"
import { API_BASE_URL } from '../utils/http';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await post<LoginResponse>("/api/auth/login", credentials);
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  async registerWithFile(data: RegisterRequest): Promise<RegisterResponse> {
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
  },

  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    const response = await post<RegisterResponse>("/api/auth/register", credentials);

    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout() {
    removeAuthToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  async getCurrentUser(): Promise<UserDto> {
    return get<UserDto>("/api/auth/me");
  }
};
