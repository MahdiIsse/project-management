"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {  } from "@/features/workspace";
import { useAssignees } from "@/features/task-management";



export function useDashboardHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentWorkspaceId = searchParams.get("workspace");

  const { data: assignees = [] } = useAssignees();



  return {
    isDialogOpen,
    setIsDialogOpen,

    currentWorkspaceId,
    assignees,
  };
}