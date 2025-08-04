import { useMutation } from "@tanstack/react-query";
import {login, signup} from "@/features/auth/actions"
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/dashboard")
    }
  })
}

export function useSignup() {
  const router = useRouter()

  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      router.push("/dashboard?newUser=true")
    }
  })
}