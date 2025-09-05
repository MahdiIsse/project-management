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

export interface UserDto {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt?: string;
  roles?: string[];
}