"use client";

import { useState, Suspense } from "react";
import {
  DashboardHeader,
  TaskBoard,
  TaskListView,
} from "@/features/task-management";
import type { ViewMode } from "@/features/task-management";
import { TestingButtons } from "./layout/DeleteUserDataTesting";
import { useDashboardContainer } from "../hooks/useDashboardContainer";

export function DashboardContainer() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  useDashboardContainer();

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
          onViewChange={setCurrentView}
        />
      </Suspense>
      <div className="flex-1">{renderView()}</div>
    </div>
  );
}
