import { Column } from "../types";
import { ColumnDto } from "../../../shared/types";

export function mapColumnFromDotNet(dto: ColumnDto): Column {
  return {
    id: dto.id,
    title: dto.title,
    position: dto.position,
    workspaceId: dto.workspaceId,
    color: dto.color ?? undefined,
    createdAt: dto.createdAt,
  };
}

