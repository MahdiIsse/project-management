"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Badge,
} from "@/shared";
import { useTaskFilters } from "../../hooks/task/useTaskFilters";

import { FilterAssigneeSelector } from "./FilterAssigneeSelector";
import { FilterPrioritySelector } from "./TaskPrioritySelector";

export function TaskFilters() {
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useTaskFilters();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    updateFilters({ search: value || undefined });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1 max-w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Zoek taken..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative flex-shrink-0"
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 p-0 items-center justify-center"
              >
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4" />
                  Wissen
                </Button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Toegewezen aan
              </label>
              <FilterAssigneeSelector
                value={filters.assigneeIds || []}
                onChange={(assigneeIds) => updateFilters({ assigneeIds })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Prioriteit
              </label>
              <FilterPrioritySelector
                value={filters.priorities || []}
                onChange={(priorities) => updateFilters({ priorities })}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
