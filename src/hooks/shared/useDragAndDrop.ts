import { useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface UseDragAndDropProps<T extends { id: string }> {
  items: T[];
  entityType: string;
  onReorder: (updates: Array<{id: string, position: number}>, optimisticItems: T[]) => void;
}

export function useDragAndDrop<T extends { id: string }>({ 
  items, 
  entityType,
  onReorder 
}: UseDragAndDropProps<T>) {
  const [localItems, setLocalItems] = useState<T[] | null>(null);
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const displayItems = localItems || items;

  const handleDragStart = (event: DragStartEvent) => {
    const draggingItem = displayItems.find(
      (item) => item.id === event.active.id
    );
    setActiveItem(draggingItem || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    
    const { active, over } = event;
    if (!over) {
      setLocalItems(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      setLocalItems(null);
      return;
    }

    const isActiveCorrectType = active.data.current?.type === entityType;
    const isOverCorrectType = over.data.current?.type === entityType;

    if (!isActiveCorrectType || !isOverCorrectType) {
      setLocalItems(null);
      return;
    }

    const oldIndex = displayItems.findIndex((item) => item.id === activeId);
    const newIndex = displayItems.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || newIndex === -1) {
      setLocalItems(null);
      return;
    }

    const newItems = arrayMove(displayItems, oldIndex, newIndex);
    setLocalItems(newItems);

    const updates = newItems.map((item, index) => ({
      id: item.id,
      position: index
    }));

    onReorder(updates, newItems);
  };

  return {
    handleDragStart,
    handleDragEnd,
    displayItems,
    activeItem
  };
} 