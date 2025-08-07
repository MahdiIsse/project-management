import { useDragAndDrop } from "@/shared";
import { useUpdateColumnsPositions } from "./useColumns";
import { Column } from "@/features/task-management/types";

interface UseColumnDragAndDropProps {
  columns: Column[]
  workspaceId: string
}

export function useColumnDragAndDrop({columns}: UseColumnDragAndDropProps) {

  const {mutate: updateColumnPositions} = useUpdateColumnsPositions()

  const onReorder = (
    updates: Array<{id: string, position: number}>,
    
  ) => {
    updateColumnPositions(updates);
  }

  return useDragAndDrop({
    items: columns,
    entityType: "Column",
    onReorder
  })
}