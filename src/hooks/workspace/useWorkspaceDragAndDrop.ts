import { useDragAndDrop } from "../shared/useDragAndDrop";
import { useUpdateWorkspacesPositions } from "./useWorkspaces";
import { Workspace } from "@/types";

interface UseWorkspaceDragAndDropProps {
  workspaces: Workspace[];
}

export function useWorkspaceDragAndDrop({ workspaces }: UseWorkspaceDragAndDropProps) {

  const { mutate: updatePositions } = useUpdateWorkspacesPositions();

  const onReorder = (
    updates: Array<{id: string, position: number}>,
    optimisticWorkspaces: Workspace[]
  ) => {
    updatePositions({updates, optimisticWorkspaces });
  };

  return useDragAndDrop({
    items: workspaces,
    entityType: "Workspace",
    onReorder
  });
} 