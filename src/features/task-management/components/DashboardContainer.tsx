"use client";

import { useEffect, useState } from "react";
import {
  DashboardHeader,
  TaskBoard,
  TaskListView,
} from "@/features/task-management";
import type { ViewMode } from "@/features/task-management";
import { TestingButtons } from "./layout/DeleteUser";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function DashboardContainer() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isNewUser = searchParams?.get("newUser") === "true";
    if (isNewUser) {
      queryClient.invalidateQueries();
    }
  }, [queryClient, searchParams]);

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
      {/* <TestingButtons /> */}
      <DashboardHeader
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <div className="flex-1">{renderView()}</div>
    </div>
  );
}
