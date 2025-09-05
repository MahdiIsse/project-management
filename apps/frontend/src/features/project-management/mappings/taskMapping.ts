import {
  Task,
  mapAssigneeFromDotNet,
  mapTagFromDotNet,
  convertPriorityFromBackend,
} from '@/features/project-management';
import { ProjectTaskDto } from '@/shared';

export function mapTaskFromDotNet(dotnetTask: ProjectTaskDto): Task {
  return {
    id: dotnetTask.id,
    title: dotnetTask.title,
    description: dotnetTask.description,
    dueDate: dotnetTask.dueDate,
    priority: convertPriorityFromBackend(dotnetTask.priority),
    position: dotnetTask.position,
    columnId: dotnetTask.columnId,
    workspaceId: dotnetTask.workspaceId,
    createdAt: dotnetTask.createdAt,
    assignees: dotnetTask.assignees.map(mapAssigneeFromDotNet),
    tags: dotnetTask.tags.map(mapTagFromDotNet),
  };
}
