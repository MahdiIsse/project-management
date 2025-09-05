import { Tag } from "../types/tag";
import { TagDto } from "@/shared";

export function mapTagFromDotNet(dto: TagDto): Tag {
  return {
    id: dto.id,
    name: dto.name,
    color: dto.color ?? undefined,
    createdAt: dto.createdAt,
  };
}