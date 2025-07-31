"use client";

import { useState } from "react";
import {
  DashboardHeader,
  TaskBoard,
  TaskListView,
} from "@/features/task-management";
import type { ViewMode } from "@/features/task-management";

export function DashboardContainer() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");

  const renderView = () => {
    switch (currentView) {
      case "list":
        return <TaskListView />;
      case "board":
        return <TaskBoard />;
      default:
        return <TaskListView />;
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <DashboardHeader
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <div className="flex-1">{renderView()}</div>
    </div>
  );
}
