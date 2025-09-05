import { UploadResponse } from "../types";
import { API_BASE_URL, getAuthToken } from "../utils/http";

export const uploadService = {
   async uploadFile(endpoint: string, file: File): Promise<UploadResponse> {
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
}
