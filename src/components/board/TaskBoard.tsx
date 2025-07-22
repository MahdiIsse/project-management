"use client";

import { useState } from "react";
import { useColumns } from "@/hooks/useColumns";
import { useSearchParams } from "next/navigation";
import { TaskColumn } from "./TaskColumn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnForm } from "../form/ColumnForm";
import { Plus } from "lucide-react";

export function TaskBoard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") ?? "";

  const {
    data: columns,
    isLoading: columnsLoading,
    isError: columnsError,
  } = useColumns(workspaceId);

  // Loading state
  if (columnsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Workspace laden...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (columnsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">
            Oeps, er ging iets mis bij het ophalen van de data.
          </p>
          <p className="text-sm text-muted-foreground">
            Probeer het opnieuw of wissel van workspace.
          </p>
        </div>
      </div>
    );
  }

  // No workspace selected
  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Geen workspace geselecteerd
          </p>
          <p className="text-sm text-muted-foreground">
            Selecteer een workspace uit de sidebar.
          </p>
        </div>
      </div>
    );
  }

  // No columns in workspace
  if (!columns || columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Geen kolommen in deze workspace
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Eerste kolom toevoegen
              </button>
            </DialogTrigger>
            <DialogContent>
              <ColumnForm
                workspaceId={workspaceId}
                closeDialog={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex h-full flex-col gap-4 lg:flex-row lg:overflow-x-auto">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            workspaceId={workspaceId}
          />
        ))}

        <DialogTrigger asChild>
          <div className="flex h-fit min-h-[200px] flex-shrink-0 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-6 text-center transition-all duration-200 hover:border-muted-foreground/40 hover:bg-muted/20 hover:shadow-sm lg:w-64 cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Nieuwe kolom</h3>
              <p className="text-sm text-muted-foreground">
                Voeg een kolom toe aan je board
              </p>
            </div>
          </div>
        </DialogTrigger>
      </div>

      <DialogContent>
        <ColumnForm
          workspaceId={workspaceId}
          closeDialog={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
