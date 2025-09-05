export const API_BASE_URL = 'https://projectmanagement-mi.azurewebsites.net';

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  }
}

function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    document.cookie =
      'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function get<T>(endpoint: string): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'GET' });
}

export async function post<T>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function put<T>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function patch<T>(endpoint: string, data: unknown): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function del<T>(endpoint: string): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'DELETE' });
}

export { setAuthToken, removeAuthToken, getAuthToken };
