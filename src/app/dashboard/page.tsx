"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { TaskBoard } from "@/components/board/TaskBoard";

type ViewMode = "list" | "board" | "calendar";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("board");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Conditional rendering based on view */}
      {currentView === "board" && <TaskBoard />}
      {currentView === "list" && (
        <div className="text-center py-12 text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">Lijst Weergave</h2>
          <p>Coming soon...</p>
        </div>
      )}
      {currentView === "calendar" && (
        <div className="text-center py-12 text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">Kalender Weergave</h2>
          <p>Coming soon...</p>
        </div>
      )}
    </div>
  );
}
