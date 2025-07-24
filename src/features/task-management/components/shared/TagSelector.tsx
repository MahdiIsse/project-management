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
} from "@/shared";
import { cn } from "@/shared";
import { Plus, Search, Check, Tag as TagIcon } from "lucide-react";
import type { Tag } from "@/features/task-management/types";
import { useTags } from "@/features/task-management/hooks";
import {
  useAddTagToTask,
  useRemoveTagFromTask,
} from "@/features/task-management/hooks";
import { TagCreateForm } from "@/features/task-management/components/form";

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
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Data hooks
  const { data: allTags, isLoading: isLoadingAll } = useTags();

  // Action hooks
  const { mutate: addTag, isPending: isAdding } = useAddTagToTask();
  const { mutate: removeTag, isPending: isRemoving } = useRemoveTagFromTask();

  // Safe data access
  const safeAllTags = allTags || [];
  const safeTaskTags = tags || [];

  const visibleTags = safeTaskTags.slice(0, maxVisible);
  const remainingCount = safeTaskTags.length - maxVisible;

  // Filter available tags based on search
  const filteredTags = safeAllTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if tag is currently assigned to task
  const isAssigned = (tagId: string) =>
    safeTaskTags.some((tag) => tag.id === tagId);

  // Handle tag toggle
  const handleTagToggle = (tag: Tag) => {
    if (isAssigned(tag.id)) {
      removeTag({ taskId, tagId: tag.id });
    } else {
      addTag({ taskId, tagId: tag.id });
    }
  };

  // Check if search query matches existing tag
  const searchMatchesExisting = filteredTags.some(
    (tag) => tag.name.toLowerCase() === searchQuery.toLowerCase()
  );

  // ✅ Heeft de task al tags?
  const hasTags = safeTaskTags.length > 0;

  return (
    // ✅ Gebruik flex-nowrap en overflow-hidden voor 1 regel
    <div className="flex items-center gap-1 overflow-hidden">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {hasTags ? (
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity",
                layout === "stacked" && "flex-col items-start"
              )}
            >
              {/* Current Tags */}
              {visibleTags.map((tag) => (
                <Badge
                  key={tag.id}
                  className={cn(
                    tag.colorBg,
                    tag.colorText,
                    "transition-transform hover:scale-105 flex-shrink-0",
                    variant === "compact" && "text-xs px-1.5 py-0.5"
                  )}
                >
                  {tag.name}
                </Badge>
              ))}

              {/* Remaining Count */}
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
            {/* Header */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                Beheer Tags
              </h4>

              {/* Search Input */}
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

            {/* Create New Tag Suggestion */}
            {searchQuery && !searchMatchesExisting && !showCreateForm && (
              <div className="border border-dashed border-primary/30 rounded-md p-3 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Maak &quot;{searchQuery}&quot;
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreateForm(true)}
                    className="h-7 px-2 text-xs"
                  >
                    Maken
                  </Button>
                </div>
              </div>
            )}

            {/* Tags List */}
            {!showCreateForm && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoadingAll ? (
                  // Loading skeletons
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-5 w-16 rounded" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))
                ) : filteredTags.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    {searchQuery
                      ? "Geen tags gevonden"
                      : "Geen tags beschikbaar"}
                  </div>
                ) : (
                  filteredTags.map((tag) => {
                    const assigned = isAssigned(tag.id);

                    return (
                      <div
                        key={tag.id}
                        className={cn(
                          "flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors",
                          "hover:bg-muted/50",
                          assigned && "bg-muted"
                        )}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {/* Checkbox */}
                        <Checkbox
                          checked={assigned}
                          disabled={isAdding || isRemoving}
                          className="pointer-events-none"
                        />

                        {/* Tag Preview */}
                        <Badge
                          className={cn(
                            tag.colorBg,
                            tag.colorText,
                            "pointer-events-none text-xs"
                          )}
                        >
                          {tag.name}
                        </Badge>

                        {/* Tag Name */}
                        <span className="flex-1 text-sm font-medium truncate">
                          {tag.name}
                        </span>

                        {/* Status indicator */}
                        {assigned && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Footer */}
            {!showCreateForm && safeTaskTags.length > 0 && (
              <div className="pt-2 border-t text-xs text-muted-foreground">
                {safeTaskTags.length}{" "}
                {safeTaskTags.length === 1 ? "tag" : "tags"} toegewezen
              </div>
            )}
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <TagCreateForm
              initialName={searchQuery}
              onSuccess={(newTag) => {
                // ✅ Auto-assign nieuwe tag aan task!
                addTag(
                  { taskId, tagId: newTag.id },
                  {
                    onSuccess: () => {
                      setShowCreateForm(false);
                      setSearchQuery("");
                      setIsOpen(false);
                    },
                  }
                );
              }}
              className="border-t-0"
            />
          )}

          {/* Back Button when showing create form */}
          {showCreateForm && (
            <div className="px-4 pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="w-full h-7 text-xs"
              >
                ← Terug naar tags
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
