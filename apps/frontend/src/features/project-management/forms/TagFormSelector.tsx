'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Checkbox,
  FormLabel,
  Dialog,
  DialogContent,
  cn,
} from '@/shared';
import { Search, Check, Tag as TagIcon, Plus } from 'lucide-react';
import {
  useTags,
  getTagColorByName,
  Tag,
  TagForm,
} from '@/features/project-management';

interface TagFormSelectorProps {
  value: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagFormSelector({ value, onChange }: TagFormSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tags } = useTags();

  const filteredTags =
    tags?.filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const selectedTags = tags?.filter((tag) => value.includes(tag.id)) || [];

  const handleToggleTag = (tagId: string) => {
    const newValue = value.includes(tagId)
      ? value.filter((id) => id !== tagId)
      : [...value, tagId];
    onChange(newValue);
  };

  const handleCreateClick = () => {
    setIsDialogOpen(true);
    setIsPopoverOpen(false);
  };

  const handleTagCreated = (newTag: Tag) => {
    const newValue = [...value, newTag.id];
    onChange(newValue);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium">Tags</FormLabel>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start h-auto min-h-[40px] p-2"
            >
              {selectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => {
                    const colors = getTagColorByName(tag.color || 'Grijs');
                    return (
                      <Badge
                        key={tag.id}
                        className={cn(
                          'text-xs',
                          colors?.colorBg,
                          colors?.colorText
                        )}
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TagIcon className="h-4 w-4" />
                  <span>Selecteer tags...</span>
                </div>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div
              className="max-h-60 overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
            >
              {filteredTags.length > 0 ? (
                <div className="p-1">
                  {filteredTags.map((tag) => {
                    const isSelected = value.includes(tag.id);
                    const colors = getTagColorByName(tag.color || 'Grijs');
                    return (
                      <div
                        key={tag.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleToggleTag(tag.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          className="pointer-events-none"
                        />
                        <Badge
                          className={cn(
                            'text-xs',
                            colors?.colorBg,
                            colors?.colorText
                          )}
                        >
                          {tag.name}
                        </Badge>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <TagIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Geen tags gevonden</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t">
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <TagForm onSuccess={handleTagCreated} initialName={searchQuery} />
        </DialogContent>
      </Dialog>
    </>
  );
}
