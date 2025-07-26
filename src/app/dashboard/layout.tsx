import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { TopNavBar } from "@/features/workspace/components";
import { AppSidebar } from "@/features/workspace/components/sidebar/AppSidebar";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopNavBar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
