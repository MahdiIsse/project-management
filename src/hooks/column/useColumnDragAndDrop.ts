import { useDragAndDrop } from "../shared/useDragAndDrop";
import { useUpdateColumnsPositions } from "./useColumns";
import {Column} from "@/types"

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