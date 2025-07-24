import { useDragAndDrop } from "@/shared";
import { useUpdateColumnsPositions } from "@/features/task-management/hooks/column";
import { Column } from "@/features/task-management/types";

interface UseColumnDragAndDropProps {
  columns: Column[]
  workspaceId: string
}

export function useColumnDragAndDrop({columns, workspaceId}: UseColumnDragAndDropProps) {

  const {mutate: updatePositions} = useUpdateColumnsPositions()

  const onReorder = (
    updates: Array<{id: string, position: number}>,
    optimisticColumns: Column[]
  ) => {
    updatePositions({updates, optimisticColumns, workspaceId})
  }

  return useDragAndDrop({
    items: columns,
    entityType: "Column",
    onReorder
  })
}