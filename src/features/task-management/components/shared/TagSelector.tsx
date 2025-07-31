"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Checkbox,
  Skeleton,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/shared";
import { cn } from "@/shared";
import {
  Plus,
  Search,
  MoreHorizontal,
  Tag as TagIcon,
  Settings,
  Trash2,
} from "lucide-react";
import type { Tag } from "@/features/task-management/types";
import { useTags, useDeleteTag } from "@/features/task-management/hooks";
import {
  useAddTagToTask,
  useRemoveTagFromTask,
} from "@/features/task-management/hooks";
import { TagCreateForm } from "@/features/task-management/components/form";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { getTagColorByName } from "@/features/task-management/utils";

interface TagSelectorProps {
  tags: Tag[];
  taskId: string;
  maxVisible?: number;
  variant?: "default" | "compact";
  showAddButton?: boolean;
  layout?: "inline" | "stacked";
}

export function TagSelector({
  taskId,
  maxVisible = 4,
  variant = "default",
  showAddButton = true,
  tags,
  layout = "inline",
}: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>(undefined);

  // Data hooks
  const { data: allTags, isLoading: isLoadingAll } = useTags();

  // Action hooks
  const { mutate: addTag, isPending: isAdding } = useAddTagToTask();
  const { mutate: removeTag, isPending: isRemoving } = useRemoveTagFromTask();
  const { mutate: deleteTag } = useDeleteTag();

  // Safe data access
  const safeAllTags = allTags || [];
  const safeTaskTags = tags || [];

  const visibleTags = safeTaskTags.slice(0, maxVisible);
  const remainingCount = safeTaskTags.length - maxVisible;

  // Filter available tags based on search
  const filteredTags = safeAllTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAssigned = (tagId: string) =>
    safeTaskTags.some((tag) => tag.id === tagId);

  const handleTagToggle = (tag: Tag) => {
    if (isAssigned(tag.id)) {
      removeTag({ taskId, tagId: tag.id });
    } else {
      addTag({ taskId, tagId: tag.id });
    }
  };

  const handleCreateClick = () => {
    setSelectedTag(undefined);
    setIsCreateDialogOpen(true);
    setIsPopoverOpen(false); // Close popover for cleaner UX
  };

  const handleEditClick = (tag: Tag) => {
    setSelectedTag(tag);
    setIsEditDialogOpen(true);
    setIsPopoverOpen(false);
  };

  const handleDeleteRequest = (tag: Tag) => {
    setSelectedTag(tag);
    setIsDeleteConfirmOpen(true);
    setIsPopoverOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedTag) {
      deleteTag(selectedTag.id, {
        onSuccess: () => setIsDeleteConfirmOpen(false),
      });
    }
  };

  const hasTags = safeTaskTags.length > 0;

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        {hasTags ? (
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity",
                layout === "stacked" && "flex-col items-start"
              )}
            >
              {visibleTags.map((tag) => {
                const colors = getTagColorByName(tag.colorName);
                return (
                  <Badge
                    key={tag.id}
                    className={cn(
                      colors?.colorBg,
                      colors?.colorText,
                      "transition-transform hover:scale-105 flex-shrink-0",
                      variant === "compact" && "text-xs px-1.5 py-0.5"
                    )}
                  >
                    {tag.name}
                  </Badge>
                );
              })}
              {remainingCount > 0 && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-muted-foreground flex-shrink-0",
                    variant === "compact" && "text-xs px-1.5 py-0.5"
                  )}
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          </PopoverTrigger>
        ) : (
          showAddButton && (
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-6 px-2 border-dashed text-muted-foreground hover:text-foreground hover:border-primary/50",
                  "transition-colors flex-shrink-0",
                  variant === "compact" && "h-5 px-1.5 text-xs"
                )}
              >
                <Plus
                  className={cn(
                    "h-3 w-3 mr-1",
                    variant === "compact" && "h-2.5 w-2.5 mr-0.5"
                  )}
                />
                Tag
              </Button>
            </PopoverTrigger>
          )
        )}

        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                Beheer Tags
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Zoek tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {isLoadingAll ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))
              ) : filteredTags.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Geen tags gevonden
                </div>
              ) : (
                filteredTags.map((tag) => {
                  const assigned = isAssigned(tag.id);
                  const colors = getTagColorByName(tag.colorName);
                  return (
                    <div
                      key={tag.id}
                      className={cn(
                        "group flex items-center space-x-3 p-2 rounded-md transition-colors",
                        "hover:bg-muted/50",
                        assigned && "bg-muted"
                      )}
                    >
                      <Checkbox
                        checked={assigned}
                        disabled={isAdding || isRemoving}
                        className="pointer-events-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagToggle(tag);
                        }}
                      />
                      <Badge
                        className={cn(
                          colors?.colorBg,
                          colors?.colorText,
                          "pointer-events-none text-xs cursor-pointer"
                        )}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag.name}
                      </Badge>
                      <span
                        className="flex-1 text-sm font-medium truncate cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag.name}
                      </span>

                      {/* Action Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent/50 rounded ml-auto shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(tag)}
                            className="cursor-pointer"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(tag)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })
              )}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleCreateClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe tag aanmaken
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe tag aanmaken</DialogTitle>
            <DialogDescription>
              Creëer een nieuwe tag om je taken te organiseren. De tag wordt
              automatisch aan de huidige taak toegewezen.
            </DialogDescription>
          </DialogHeader>
          <TagCreateForm
            initialName={searchQuery}
            onSuccess={(newTag) => {
              addTag(
                { taskId, tagId: newTag.id },
                {
                  onSuccess: () => {
                    setIsCreateDialogOpen(false);
                    setSearchQuery("");
                  },
                }
              );
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag bewerken</DialogTitle>
            <DialogDescription>
              Bewerk de details van de tag &quot;{selectedTag?.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          {selectedTag && (
            <TagCreateForm
              initialName={selectedTag.name}
              tagToEdit={selectedTag}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedTag(undefined);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType="tag"
        itemName={selectedTag?.name}
      />
    </>
  );
}
