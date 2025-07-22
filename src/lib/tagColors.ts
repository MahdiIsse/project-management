import {Tag} from "@/types"

export const TAG_COLORS = [
  {
    name: 'blue',
    colorBg: 'bg-blue-400',
    colorText: 'text-blue-700',
    colorName: 'Blauw'  
  },
  {
    name: 'green',
    colorBg: 'bg-green-400',
    colorText: 'text-green-700',
    colorName: 'Groen'
  },
  {
    name: 'red',
    colorBg: 'bg-red-400',
    colorText: 'text-red-700',
    colorName: 'Rood'
  },
  {
    name: 'yellow',
    colorBg: 'bg-yellow-400',
    colorText: 'text-yellow-700',
    colorName: 'Geel'
  },
  {
    name: 'purple',
    colorBg: 'bg-purple-400',
    colorText: 'text-purple-700',
    colorName: 'Paars'
  },
  {
    name: 'pink',
    colorBg: 'bg-pink-400',
    colorText: 'text-pink-700',
    colorName: 'Roze'
  },
  {
    name: 'indigo',
    colorBg: 'bg-indigo-400',
    colorText: 'text-indigo-700',
    colorName: 'Indigo'
  },
  {
    name: 'gray',
    colorBg: 'bg-gray-400',
    colorText: 'text-gray-700',
    colorName: 'Grijs'
  },
  {
    name: 'orange',
    colorBg: 'bg-orange-400',
    colorText: 'text-orange-700',
    colorName: 'Oranje'
  },
  {
    name: 'teal',
    colorBg: 'bg-teal-400',
    colorText: 'text-teal-700',
    colorName: 'Teal'
  }
] as const;

// Type voor technische naam autocomplete
export type TagColorInternalName = typeof TAG_COLORS[number]['name'];

// Helper functies
export function getTagColorByName(internalName: string): Omit<Tag, "id"> | undefined {
  return TAG_COLORS.find(color => color.name === internalName)
}

export function getTagColorByDisplayName(displayName: string): Omit<Tag, "id"> | undefined {
  return TAG_COLORS.find(color => color.colorName === displayName);
}