export const COLORS = [
  {
    name: 'Blauw',
    border: 'border-blue-400',
    colorBg: 'bg-blue-400/20 dark:bg-blue-400/30',
    colorText: 'text-blue-700 dark:text-blue-200',
    columnBg: 'bg-blue-100/70 dark:bg-blue-950/40',
    columnText: 'text-blue-600 dark:text-blue-300',
  },
  {
    name: 'Groen',
    border: 'border-green-400',
    colorBg: 'bg-green-400/20 dark:bg-green-400/30',
    colorText: 'text-green-700 dark:text-green-200',
    columnBg: 'bg-green-100/70 dark:bg-green-950/40',
    columnText: 'text-green-600 dark:text-green-300',
  },
  {
    name: 'Rood',
    border: 'border-red-400',
    colorBg: 'bg-red-400/20 dark:bg-red-400/30',
    colorText: 'text-red-700 dark:text-red-200',
    columnBg: 'bg-red-100/70 dark:bg-red-950/40',
    columnText: 'text-red-600 dark:text-red-300',
  },
  {
    name: 'Geel',
    border: 'border-yellow-400',
    colorBg: 'bg-yellow-300/30 dark:bg-yellow-400/20',
    colorText: 'text-yellow-800 dark:text-yellow-200',
    columnBg: 'bg-yellow-100/70 dark:bg-yellow-950/40',
    columnText: 'text-yellow-700 dark:text-yellow-300',
  },
  {
    name: 'Paars',
    border: 'border-purple-400',
    colorBg: 'bg-purple-400/20 dark:bg-purple-400/30',
    colorText: 'text-purple-700 dark:text-purple-200',
    columnBg: 'bg-purple-100/70 dark:bg-purple-950/40',
    columnText: 'text-purple-600 dark:text-purple-300',
  },
  {
    name: 'Roze',
    border: 'border-pink-400',
    colorBg: 'bg-pink-400/20 dark:bg-pink-400/30',
    colorText: 'text-pink-700 dark:text-pink-200',
    columnBg: 'bg-pink-100/70 dark:bg-pink-950/40',
    columnText: 'text-pink-600 dark:text-pink-300',
  },
  {
    name: 'Indigo',
    border: 'border-indigo-400',
    colorBg: 'bg-indigo-400/20 dark:bg-indigo-400/30',
    colorText: 'text-indigo-700 dark:text-indigo-200',
    columnBg: 'bg-indigo-100/70 dark:bg-indigo-950/40',
    columnText: 'text-indigo-600 dark:text-indigo-300',
  },
  {
    name: 'Grijs',
    border: 'border-gray-400',
    colorBg: 'bg-gray-400/20 dark:bg-gray-400/30',
    colorText: 'text-gray-700 dark:text-gray-200',
    columnBg: 'bg-gray-50/80 dark:bg-gray-950/40',
    columnText: 'text-gray-600 dark:text-gray-300',
  },
  {
    name: 'Oranje',
    border: 'border-orange-400',
    colorBg: 'bg-orange-400/20 dark:bg-orange-400/30',
    colorText: 'text-orange-700 dark:text-orange-200',
    columnBg: 'bg-orange-100/70 dark:bg-orange-950/40',
    columnText: 'text-orange-600 dark:text-orange-300',
  },
  {
    name: 'Teal',
    border: 'border-teal-400',
    colorBg: 'bg-teal-400/20 dark:bg-teal-400/30',
    colorText: 'text-teal-700 dark:text-teal-200',
    columnBg: 'bg-teal-100/70 dark:bg-teal-950/40',
    columnText: 'text-teal-600 dark:text-teal-300',
  }
] as const;

export const WORKSPACE_COLORS = [
  { name: 'Hikoko', bg: 'bg-sky-950', text: 'text-sky-300', icon: 'bg-orange-400' },
  { name: 'Sunset', bg: 'bg-rose-950', text: 'text-rose-200', icon: 'yellow-400' },
  { name: 'Forest', bg: 'bg-emerald-950', text: 'text-emerald-200', icon: 'lime-400' },
  { name: 'Royal', bg: 'bg-indigo-950', text: 'text-indigo-200', icon: 'fuchsia-400' },
  { name: 'Default', bg: 'bg-slate-900', text: 'text-slate-300', icon: 'slate-400' },
] as const;


export type ColorInternalName = typeof COLORS[number]['name'];
export type WorkspaceColorName = typeof WORKSPACE_COLORS[number]['name'];

export function getWorkspaceColor(name: string | null | undefined) {
  if (!name) return WORKSPACE_COLORS.find(c => c.name === 'Default')!;
  const color = WORKSPACE_COLORS.find(c => c.name === name);
  return color || WORKSPACE_COLORS.find(c => c.name === 'Default')!;
}

export function getTagColorByName(internalName: string) {
  const color = COLORS.find(color => color.name === internalName);
  if (!color) return undefined;
  
  return {
    name: color.name,
    colorBg: color.colorBg,
    colorText: color.colorText,
  };
}

export function getTagColorByDisplayName(displayName: string) {
  const color = COLORS.find(color => color.name === displayName);
  if (!color) return undefined;
  
  return {
    name: color.name,
    colorBg: color.colorBg,
    colorText: color.colorText,
  };
}

export function getColumnColorByName(internalName: string) {
  const color = COLORS.find(color => color.name === internalName);
  if (!color) return undefined;
  
  return {
    name: color.name,
    border: color.border,
  };
}

export function getColumnColorByDisplayName(displayName: string) {
  const color = COLORS.find(color => color.name === displayName);
  if (!color) return undefined;
  
  return {
    name: color.name,
    border: color.border,
  };
}

export function getColumnColorsByBorder(border: string | undefined | null) {
  if (!border) {
    return {
      columnBg: 'bg-gray-50/80 dark:bg-gray-950/40',
      columnText: 'text-gray-600 dark:text-gray-300',
    };
  }
  const color = COLORS.find(c => c.border === border);
  return color || {
    columnBg: 'bg-gray-50/80 dark:bg-gray-950/40',
    columnText: 'text-gray-600 dark:text-gray-300',
  };
}
