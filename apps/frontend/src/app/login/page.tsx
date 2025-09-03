import { LoginForm } from "../../features/auth/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/abstract.jpg"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.3] "
        />
      </div>
    </div>
  );
}
