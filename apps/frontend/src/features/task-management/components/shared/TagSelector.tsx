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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../../../../shared";
import { cn } from "../../../../shared";
import {
  Plus,
  Search,
  MoreHorizontal,
  Tag as TagIcon,
  Settings,
  Trash2,
} from "lucide-react";
import type { Tag } from "../../types";
import { useTags, useDeleteTag } from "../../hooks";
import {
  useAddTagToTask,
  useRemoveTagFromTask,
} from "../../hooks";
import { TagForm } from "../form";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { getTagColorByName } from "../../utils";

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

  const { data: allTags } = useTags();
  const { mutate: addTag, isPending: isAdding } = useAddTagToTask();
  const { mutate: removeTag, isPending: isRemoving } = useRemoveTagFromTask();
  const { mutate: deleteTag } = useDeleteTag();

  const safeAllTags = allTags || [];
  const safeTaskTags = tags || [];

  const visibleTags = safeTaskTags.slice(0, maxVisible);
  const remainingCount = safeTaskTags.length - maxVisible;

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
    setIsPopoverOpen(false);
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
                const colors = getTagColorByName(tag.color || "Grijs");
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
              {filteredTags.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Geen tags gevonden
                </div>
              ) : (
                filteredTags.map((tag) => {
                  const assigned = isAssigned(tag.id);
                  const colors = getTagColorByName(tag.color || "Grijs");

                  return (
                    <div
                      key={tag.id}
                      className={cn(
                        "group flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors select-none",
                        "hover:bg-muted/50",
                        assigned && "bg-muted"
                      )}
                      onClick={() => handleTagToggle(tag)}
                    >
                      <Checkbox
                        checked={assigned}
                        disabled={isAdding || isRemoving}
                        className="pointer-events-none"
                      />
                      <Badge
                        className={cn(
                          "text-xs pointer-events-none",
                          colors?.colorBg,
                          colors?.colorText,
                          "pointer-events-none text-xs cursor-pointer"
                        )}
                      >
                        {tag.name}
                      </Badge>
                      <span
                        className="flex-1 text-sm font-medium truncate cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag.name}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent/50 rounded ml-auto shrink-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(tag);
                            }}
                            className="cursor-pointer"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRequest(tag);
                            }}
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe tag aanmaken</DialogTitle>
            <DialogDescription>
              Creëer een nieuwe tag om je taken te organiseren. De tag wordt
              automatisch aan de huidige taak toegewezen.
            </DialogDescription>
          </DialogHeader>
          <TagForm
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag bewerken</DialogTitle>
            <DialogDescription>
              Bewerk de details van de tag &quot;{selectedTag?.name}&quot;.
            </DialogDescription>
          </DialogHeader>
          {selectedTag && (
            <TagForm
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
