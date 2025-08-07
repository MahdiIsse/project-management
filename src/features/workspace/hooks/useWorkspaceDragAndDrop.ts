import { useDragAndDrop } from "@/shared/hooks";
import { useUpdateWorkspacesPositions } from "./useWorkspaces";
import { Workspace } from "@/features/workspace/types";

interface UseWorkspaceDragAndDropProps {
  workspaces: Workspace[];
}

export function useWorkspaceDragAndDrop({
  workspaces,
}: UseWorkspaceDragAndDropProps) {
  const { mutate: updateWorkspacesPositions } = useUpdateWorkspacesPositions();

  const onReorder = (
    updates: Array<{ id: string; position: number }>
  ) => {
    updateWorkspacesPositions(updates);
  };

  return useDragAndDrop({
    items: workspaces,
    entityType: "Workspace",
    onReorder
  });
} 