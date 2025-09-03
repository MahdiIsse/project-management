export const TAG_COLORS = [
  {
    name: 'Blauw',
    hex: '#3B82F6', 
    colorBg: 'bg-blue-400/20 dark:bg-blue-400/30',
    colorText: 'text-blue-700 dark:text-blue-200',
    pickerBg: 'bg-blue-500',
  },
  {
    name: 'Groen',
    hex: '#10B981', 
    colorBg: 'bg-green-400/20 dark:bg-green-400/30',
    colorText: 'text-green-700 dark:text-green-200',
    pickerBg: 'bg-green-500',
  },
  {
    name: 'Rood',
    hex: '#EF4444', 
    colorBg: 'bg-red-400/20 dark:bg-red-400/30',
    colorText: 'text-red-700 dark:text-red-200',
    pickerBg: 'bg-red-500',
  },
  {
    name: 'Geel',
    hex: '#EAB308', 
    colorBg: 'bg-yellow-300/30 dark:bg-yellow-400/20',
    colorText: 'text-yellow-800 dark:text-yellow-200',
    pickerBg: 'bg-yellow-500',
  },
  {
    name: 'Paars',
    hex: '#A855F7', 
    colorBg: 'bg-purple-400/20 dark:bg-purple-400/30',
    colorText: 'text-purple-700 dark:text-purple-200',
    pickerBg: 'bg-purple-500',
  },
  {
    name: 'Roze',
    hex: '#EC4899', 
    colorBg: 'bg-pink-400/20 dark:bg-pink-400/30',
    colorText: 'text-pink-700 dark:text-pink-200',
    pickerBg: 'bg-pink-500',
  },
  {
    name: 'Indigo',
    hex: '#6366F1', 
    colorBg: 'bg-indigo-400/20 dark:bg-indigo-400/30',
    colorText: 'text-indigo-700 dark:text-indigo-200',
    pickerBg: 'bg-indigo-500',
  },
  {
    name: 'Grijs',
    hex: '#6B7280', 
    colorBg: 'bg-gray-400/20 dark:bg-gray-400/30',
    colorText: 'text-gray-700 dark:text-gray-200',
    pickerBg: 'bg-gray-500',
  },
  {
    name: 'Oranje',
    hex: '#F97316', 
    colorBg: 'bg-orange-400/20 dark:bg-orange-400/30',
    colorText: 'text-orange-700 dark:text-orange-200',
    pickerBg: 'bg-orange-500',
  },
  {
    name: 'Teal',
    hex: '#14B8A6', 
    colorBg: 'bg-teal-400/20 dark:bg-teal-400/30',
    colorText: 'text-teal-700 dark:text-teal-200',
    pickerBg: 'bg-teal-500',
  }
] as const;

export type TagColorName = typeof TAG_COLORS[number]['name'];

export type TagColor = {
  name: string;
  hex: string;      
  colorBg: string;
  colorText: string;
  pickerBg: string;
};

export function getTagColorByHex(hex: string | null | undefined): TagColor {
  const defaultColor = TAG_COLORS.find((c) => c.name === "Grijs")!;
  
  if (!hex) {
    return defaultColor;
  }
  
  const color = TAG_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return color || {
    name: "Custom",
    hex: hex,
    colorBg: "bg-gray-400/20 dark:bg-gray-400/30",
    colorText: "text-gray-700 dark:text-gray-200",
    pickerBg: "bg-gray-500",
  };
}

export function getHexByTagColorName(name: string): string {
  const color = TAG_COLORS.find((c) => c.name === name);
  return color?.hex || "#6B7280";
}

export function getTagColorByName(name: string): TagColor | undefined {
  const color = TAG_COLORS.find(color => color.name === name);
  if (!color) return undefined;
  return {
    name: color.name,
    hex: color.hex,
    colorBg: color.colorBg,
    colorText: color.colorText,
    pickerBg: color.pickerBg,
  };
}

export function getTagColorByDisplayName(displayName: string): TagColor | undefined {
  return getTagColorByName(displayName);
} 