export const COLUMN_COLORS = [
  {
    name: 'Blauw',
    hex: '#3B82F6',
    border: 'border-blue-400',
    columnBg: 'bg-blue-100/70 dark:bg-blue-950/40',
    columnText: 'text-blue-600 dark:text-blue-300',
    pickerBg: 'bg-blue-500',
  },
  {
    name: 'Groen',
    hex: '#10B981',
    border: 'border-green-400',
    columnBg: 'bg-green-100/70 dark:bg-green-950/40',
    columnText: 'text-green-600 dark:text-green-300',
    pickerBg: 'bg-green-500',
  },
  {
    name: 'Rood',
    hex: '#EF4444',
    border: 'border-red-400',
    columnBg: 'bg-red-100/70 dark:bg-red-950/40',
    columnText: 'text-red-600 dark:text-red-300',
    pickerBg: 'bg-red-500',
  },
  {
    name: 'Geel',
    hex: '#EAB308',
    border: 'border-yellow-400',
    columnBg: 'bg-yellow-100/70 dark:bg-yellow-950/40',
    columnText: 'text-yellow-700 dark:text-yellow-300',
    pickerBg: 'bg-yellow-500',
  },
  {
    name: 'Paars',
    hex: '#A855F7',
    border: 'border-purple-400',
    columnBg: 'bg-purple-100/70 dark:bg-purple-950/40',
    columnText: 'text-purple-600 dark:text-purple-300',
    pickerBg: 'bg-purple-500',
  },
  {
    name: 'Roze',
    hex: '#EC4899',
    border: 'border-pink-400',
    columnBg: 'bg-pink-100/70 dark:bg-pink-950/40',
    columnText: 'text-pink-600 dark:text-pink-300',
    pickerBg: 'bg-pink-500',
  },
  {
    name: 'Indigo',
    hex: '#6366F1',
    border: 'border-indigo-400',
    columnBg: 'bg-indigo-100/70 dark:bg-indigo-950/40',
    columnText: 'text-indigo-600 dark:text-indigo-300',
    pickerBg: 'bg-indigo-500',
  },
  {
    name: 'Grijs',
    hex: '#6B7280',
    border: 'border-gray-400',
    columnBg: 'bg-gray-50/80 dark:bg-gray-950/40',
    columnText: 'text-gray-600 dark:text-gray-300',
    pickerBg: 'bg-gray-500',
  },
  {
    name: 'Oranje',
    hex: '#F97316',
    border: 'border-orange-400',
    columnBg: 'bg-orange-100/70 dark:bg-orange-950/40',
    columnText: 'text-orange-600 dark:text-orange-300',
    pickerBg: 'bg-orange-500',
  },
  {
    name: 'Teal',
    hex: '#14B8A6',
    border: 'border-teal-400',
    columnBg: 'bg-teal-100/70 dark:bg-teal-950/40',
    columnText: 'text-teal-600 dark:text-teal-300',
    pickerBg: 'bg-teal-500',
  }
] as const;

export type ColumnColorName = typeof COLUMN_COLORS[number]['name'];

export type ColumnColor = {
  name: string;
  hex: string;
  border: string;
  columnBg: string;
  columnText: string;
  pickerBg: string;
};

const DEFAULT_COLUMN_STYLE = {
  columnBg: 'bg-gray-50/80 dark:bg-gray-950/40',
  columnText: 'text-gray-600 dark:text-gray-300',
  border: 'border-gray-400',
  pickerBg: 'bg-gray-500',
  hex: '#6B7280',
} as const;

export function getColumnColorByHex(hex: string | null | undefined): ColumnColor {
  const defaultColor = COLUMN_COLORS.find((c) => c.name === "Grijs")!;
  
  if (!hex) {
    return defaultColor;
  }
  
  const color = COLUMN_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return color || {
    name: "Custom",
    hex: hex,
    border: "border-gray-400",
    columnBg: "bg-gray-50/80 dark:bg-gray-950/40",
    columnText: "text-gray-600 dark:text-gray-300",
    pickerBg: "bg-gray-500",
  };
}

export function getHexByColumnColorName(name: string): string {
  const color = COLUMN_COLORS.find((c) => c.name === name);
  return color?.hex || "#6B7280";
}

export function getColumnColorByName(name: string): ColumnColor | undefined {
  return COLUMN_COLORS.find(color => color.name === name);
}

export function getColumnColorByBorder(borderOrHex: string | undefined | null): ColumnColor {
  if (!borderOrHex) {
    return {
      name: 'Grijs',
      ...DEFAULT_COLUMN_STYLE,
    };
  }
  
  if (borderOrHex.startsWith('#')) {
    return getColumnColorByHex(borderOrHex);
  }
  
  const color = COLUMN_COLORS.find(c => c.border === borderOrHex);
  return color || {
    name: 'Grijs',
    ...DEFAULT_COLUMN_STYLE,
  };
}

export function getColumnTextStyle(colorIdentifier: string | undefined | null): string {
  const color = getColumnColorByBorder(colorIdentifier);
  return color.columnText;
}

export function getColumnBorderStyle(colorIdentifier: string | undefined | null): string {
  const color = getColumnColorByBorder(colorIdentifier);
  return color.border;
}