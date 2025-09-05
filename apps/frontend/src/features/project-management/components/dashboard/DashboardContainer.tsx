'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  TaskBoard,
  TaskListView,
  ActiveFiltersDisplay,
  type ViewMode,
} from '@/features/project-management';
import { DashboardHeader } from '@/shared';

export function DashboardContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = (searchParams.get('view') as ViewMode) || 'list';

  const handleViewChange = (view: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return (
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskListView />
          </Suspense>
        );
      case 'board':
        return (
          <Suspense fallback={<div>Loading board...</div>}>
            <TaskBoard />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskListView />
          </Suspense>
        );
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardHeader
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      </Suspense>
      <ActiveFiltersDisplay />
      <div className="flex-1">{renderView()}</div>
    </div>
  );
}
