import { Workspace } from "../types";
import { WorkspaceDto } from "@/shared";

export function mapWorkspaceFromDotNet(dto: WorkspaceDto): Workspace {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? undefined,
    color: dto.color ?? undefined,
    position: dto.position,
    createdAt: dto.createdAt,
  };
}

