import { TopNavBar, SidebarProvider } from '@/shared';
import { AppSidebar } from '@/features';
import { Toaster } from 'sonner';
import { Suspense } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Suspense fallback={<div>Loading navigation...</div>}>
            <TopNavBar />
          </Suspense>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
