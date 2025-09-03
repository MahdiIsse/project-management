import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "../../../shared/lib/api/client";
import { LoginSchemaValues, SignUpSchemaValues } from "../schemas/auth";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginSchemaValues) => {
      const response = await apiClient.login({
        email: data.email,
        password: data.password
      });
      return response;
    },
    onSuccess: (response) => {
      apiClient.setAuthToken(response.token);
      router.push("/dashboard");
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
        avatarFile: data.avatarFile
      });
      return response;
    },
    onSuccess: (response) => {
      apiClient.setAuthToken(response.token);
      router.push("/dashboard");
    },
  });
}