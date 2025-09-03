"use server"

import {LoginSchemaValues, SignUpSchemaValues} from "../schemas/auth"
import { apiClient } from "../../../shared/lib/api/client"

export async function login(data: LoginSchemaValues) {
  try {
    const response = await apiClient.login({
      email: data.email,
      password: data.password
    });
    
    return { 
      success: true, 
      token: response.token,
      expiresAt: response.expiresAtUtc 
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    return {
      success: false,
      error: errorMessage
    };
  }
}

export async function signup(data: SignUpSchemaValues) {
  try {
    const response = await apiClient.registerWithFile({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      avatarFile: data.avatarFile
    });
    
    return { 
      success: true, 
      token: response.token,
      expiresAt: response.expiresAtUtc 
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    return { 
      success: false, 
      error: errorMessage
    };
  }
}