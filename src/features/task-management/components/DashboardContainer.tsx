"use client";

import { useCallback, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DashboardHeader,
  TaskBoard,
  TaskListView,
  TaskFilters,
  isValidPriority,
} from "@/features/task-management";
import type { ViewMode } from "@/features/task-management";

export function DashboardContainer() {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const priorityParams = searchParams.get("priorities")?.split(",") ?? [];
  const validPriorities = priorityParams.filter(isValidPriority);

  const filters: TaskFilters = {
    assigneeIds: searchParams.get("assignees")?.split(",") ?? [],
    priorities: validPriorities,
    search: searchParams.get("search") ?? "",
  };

  const handleFilterChange = useCallback(
    (newFilters: Partial<TaskFilters>) => {
      const params = new URLSearchParams(searchParams);

      if (newFilters.assigneeIds) {
        if (newFilters.assigneeIds.length > 0) {
          params.set("assignees", newFilters.assigneeIds.join(","));
        } else {
          params.delete("assignees");
        }
      }

      if (newFilters.priorities) {
        if (newFilters.priorities.length > 0) {
          params.set("priorities", newFilters.priorities.join(","));
        } else {
          params.delete("priorities");
        }
      }

      if (typeof newFilters.search === "string") {
        if (newFilters.search) {
          params.set("search", newFilters.search);
        } else {
          params.delete("search");
        }
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const renderView = () => {
    switch (currentView) {
      case "list":
        return <TaskListView filters={filters} />;
      case "board":
        return <TaskBoard filters={filters} />;
      case "calendar":
        return <div>Kalenderweergave nog niet geïmplementeerd.</div>;
      default:
        return <TaskBoard filters={filters} />;
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <DashboardHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
      <div className="flex-1 overflow-hidden">{renderView()}</div>
    </div>
  );
}
