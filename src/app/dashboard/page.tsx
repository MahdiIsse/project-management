"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { TaskBoard } from "@/components/board/TaskBoard";
import { TaskListView } from "@/components/list/TaskListView";

type ViewMode = "list" | "board" | "calendar";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("board");
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace");

  // Als geen workspace geselecteerd, toon selectie message
  if (!workspaceId) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-semibold text-foreground">
            Selecteer een workspace
          </h1>
          <p className="text-muted-foreground max-w-md">
            Kies een workspace uit de sidebar om je projecten en taken te
            bekijken. Je kunt ook een nieuwe workspace aanmaken met de
            plus-knop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Conditional rendering based on view */}
      {currentView === "board" && (
        <div className="space-y-6">
          <TaskBoard />
        </div>
      )}
      {currentView === "list" && (
        <div className="space-y-6">
          <TaskListView />
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
