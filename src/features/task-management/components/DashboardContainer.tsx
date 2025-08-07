"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DashboardHeader,
  TaskBoard,
  TaskListView,
} from "@/features/task-management";
import type { ViewMode } from "@/features/task-management";
import { useDashboardContainer } from "../hooks/useDashboardContainer";
import { ActiveFiltersDisplay } from "./filter/ActiveFiltersDisplay";

export function DashboardContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useDashboardContainer();

  const currentView = (searchParams.get("view") as ViewMode) || "list";

  const handleViewChange = (view: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderView = () => {
    switch (currentView) {
      case "list":
        return (
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskListView />
          </Suspense>
        );
      case "board":
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
      {/* <TestingButtons /> */}
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
