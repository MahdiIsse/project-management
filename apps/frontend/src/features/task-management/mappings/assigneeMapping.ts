import { Assignee } from "../types/assignee";
import { AssigneeDto } from "../../../shared/types";

export function mapAssigneeFromDotNet(dto: AssigneeDto): Assignee {
  return {
    id: dto.id,
    name: dto.name,
    avatarUrl: dto.avatarUrl ?? undefined,
  };
}