import { isValidPriority, TaskFilterParams } from '../types';

export function encodeFiltersToSearchParams(filters: TaskFilterParams) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.assigneeIds?.length) {
    params.set('assignees', filters.assigneeIds.join(','));
  }

  if (filters.priorities?.length) {
    params.set('priorities', filters.priorities.join(','));
  }

  return params;
}

export function decodeFiltersFromSearchParams(
  searchParams: URLSearchParams
): TaskFilterParams {
  const filters: TaskFilterParams = {};

  const search = searchParams.get('search');
  if (search) {
    filters.search = search;
  }

  const assignees = searchParams.get('assignees');
  if (assignees) {
    filters.assigneeIds = assignees.split(',').filter(Boolean);
  }

  const priorities = searchParams.get('priorities');
  if (priorities) {
    filters.priorities = priorities.split(',').filter(isValidPriority);
  }

  return filters;
}
