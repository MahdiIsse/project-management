"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { TaskFilterParams } from "../../types";
import { encodeFiltersToSearchParams, decodeFiltersFromSearchParams } from "../../utils/filterUtils";

export function useTaskFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentFilters = decodeFiltersFromSearchParams(searchParams)

  const updateFilters = useCallback((newFilters: Partial<TaskFilterParams>) => {
    const updatedFilters = {...currentFilters, ...newFilters}

    Object.keys(updatedFilters).forEach(key => {
      const value = updatedFilters[key as keyof TaskFilterParams];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        delete updatedFilters[key as keyof TaskFilterParams]
      }
    });

    const newParams = new URLSearchParams(searchParams);

    newParams.delete("search");
    newParams.delete("assignees");
    newParams.delete("priorities");

    const filterParams = encodeFiltersToSearchParams(updatedFilters);
    filterParams.forEach((value, key) => {
      newParams.set(key, value)
    })

    router.push(`${pathname}?${newParams.toString()}`)

  }, [currentFilters, searchParams, router, pathname])

  const clearFilters = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.delete("assignees");
    newParams.delete("priorities");
    router.push(`${pathname}?${newParams.toString()}`)
  }, [searchParams, router, pathname])

  return {
    filters: currentFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters: Object.keys(currentFilters).length > 0
  }
}