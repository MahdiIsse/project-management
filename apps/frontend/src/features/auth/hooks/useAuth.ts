import { useMutation } from "@tanstack/react-query";
import {login, signup} from "../actions"
import { useRouter } from "next/navigation";
import { apiClient } from "../../../shared/lib/api/client";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      if (result.success && result.token) {
        apiClient.setAuthToken(result.token);
        
        router.push("/dashboard");
      }
    },
    onError: (error) => {
    }
  })
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (result) => {
      if (result.success && result.token) {
        apiClient.setAuthToken(result.token);
        
        router.push("/dashboard");
      }
    },
    onError: (error) => {
    }
  })
}