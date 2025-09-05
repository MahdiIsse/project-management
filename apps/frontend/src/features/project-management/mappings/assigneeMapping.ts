import { Assignee } from "../types/assignee";
import { AssigneeDto } from "@/shared";

export function mapAssigneeFromDotNet(dto: AssigneeDto): Assignee {
  return {
    id: dto.id,
    name: dto.name,
    avatarUrl: dto.avatarUrl ?? undefined,
  };
}