export const COLUMN_COLORS = [
  {
    name: 'Blauw',
    border: 'border-blue-400',
    columnBg: 'bg-blue-100/70 dark:bg-blue-950/40',
    columnText: 'text-blue-600 dark:text-blue-300',
    pickerBg: 'bg-blue-500',
  },
  {
    name: 'Groen',
    border: 'border-green-400',
    columnBg: 'bg-green-100/70 dark:bg-green-950/40',
    columnText: 'text-green-600 dark:text-green-300',
    pickerBg: 'bg-green-500',
  },
  {
    name: 'Rood',
    border: 'border-red-400',
    columnBg: 'bg-red-100/70 dark:bg-red-950/40',
    columnText: 'text-red-600 dark:text-red-300',
    pickerBg: 'bg-red-500',
  },
  {
    name: 'Geel',
    border: 'border-yellow-400',
    columnBg: 'bg-yellow-100/70 dark:bg-yellow-950/40',
    columnText: 'text-yellow-700 dark:text-yellow-300',
    pickerBg: 'bg-yellow-500',
  },
  {
    name: 'Paars',
    border: 'border-purple-400',
    columnBg: 'bg-purple-100/70 dark:bg-purple-950/40',
    columnText: 'text-purple-600 dark:text-purple-300',
    pickerBg: 'bg-purple-500',
  },
  {
    name: 'Roze',
    border: 'border-pink-400',
    columnBg: 'bg-pink-100/70 dark:bg-pink-950/40',
    columnText: 'text-pink-600 dark:text-pink-300',
    pickerBg: 'bg-pink-500',
  },
  {
    name: 'Indigo',
    border: 'border-indigo-400',
    columnBg: 'bg-indigo-100/70 dark:bg-indigo-950/40',
    columnText: 'text-indigo-600 dark:text-indigo-300',
    pickerBg: 'bg-indigo-500',
  },
  {
    name: 'Grijs',
    border: 'border-gray-400',
    columnBg: 'bg-gray-50/80 dark:bg-gray-950/40',
    columnText: 'text-gray-600 dark:text-gray-300',
    pickerBg: 'bg-gray-500',
  },
  {
    name: 'Oranje',
    border: 'border-orange-400',
    columnBg: 'bg-orange-100/70 dark:bg-orange-950/40',
    columnText: 'text-orange-600 dark:text-orange-300',
    pickerBg: 'bg-orange-500',
  },
  {
    name: 'Teal',
    border: 'border-teal-400',
    columnBg: 'bg-teal-100/70 dark:bg-teal-950/40',
    columnText: 'text-teal-600 dark:text-teal-300',
    pickerBg: 'bg-teal-500',
  }
] as const;

export type ColumnColorName = typeof COLUMN_COLORS[number]['name'];

export type ColumnColor = {
  name: string;
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
} as const;

/**
 * Zoekt column kleuren op basis van de color name
 */
export function getColumnColorByName(name: string): ColumnColor | undefined {
  return COLUMN_COLORS.find(color => color.name === name);
}

/**
 * Zoekt column kleuren op basis van de border class
 */
export function getColumnColorByBorder(border: string | undefined | null): ColumnColor {
  if (!border) {
    return {
      name: 'Grijs',
      ...DEFAULT_COLUMN_STYLE,
    };
  }
  
  const color = COLUMN_COLORS.find(c => c.border === border);
  return color || {
    name: 'Grijs',
    ...DEFAULT_COLUMN_STYLE,
  };
}

/**
 * Geeft alleen de text styling voor een column (voor use in Select componenten)
 */
export function getColumnTextStyle(border: string | undefined | null): string {
  const color = getColumnColorByBorder(border);
  return color.columnText;
}

/**
 * Geeft alleen de border styling voor een column
 */
export function getColumnBorderStyle(border: string | undefined | null): string {
  const color = getColumnColorByBorder(border);
  return color.border;
}