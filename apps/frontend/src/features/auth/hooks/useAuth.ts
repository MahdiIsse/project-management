'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared';
import { LoginSchemaValues, SignUpSchemaValues } from '@/features/auth';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginSchemaValues) => {
      const response = await apiClient.login({
        email: data.email,
        password: data.password,
      });
      return response;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpSchemaValues) => {
      const response = await apiClient.registerWithFile({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        avatarFile: data.avatarFile,
      });
      return response;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });
}
