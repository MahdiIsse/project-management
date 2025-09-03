import { Task } from "../types/task";
import { ProjectTaskDto } from "../../../shared/types";
import { mapAssigneeFromDotNet } from "./assigneeMapping";
import { mapTagFromDotNet } from "./tagMapping";
import { convertPriorityFromBackend } from "../types/priority";

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