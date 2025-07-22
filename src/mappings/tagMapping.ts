import {Tables, Tag} from "@/types"

export function mapTag(row: Tables<"tags">): Tag {
  return {
    id: row.id,
    name: row.name,
    colorBg: row.color_bg,
    colorText: row.color_text,
    colorName: row.color_name
  }
}