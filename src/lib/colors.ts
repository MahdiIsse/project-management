// Algemene color library voor tags en columns
export const COLORS = [
  {
    colorBg: 'bg-blue-400',
    colorText: 'text-blue-700',
    name: 'Blauw',
    border: 'border-blue-400',
  },
  {
    colorBg: 'bg-green-400',
    colorText: 'text-green-700',
    name: 'Groen',
    border: 'border-green-400',
  },
  {
    colorBg: 'bg-red-400',
    colorText: 'text-red-700',
    name: 'Rood',
    border: 'border-red-400',
  },
  {
    colorBg: 'bg-yellow-400',
    colorText: 'text-yellow-700',
    name: 'Geel',
    border: 'border-yellow-400',
  },
  {
    colorBg: 'bg-purple-400',
    colorText: 'text-purple-700',
    name: 'Paars',
    border: 'border-purple-400',
  },
  {
    colorBg: 'bg-pink-400',
    colorText: 'text-pink-700',
    name: 'Roze',
    border: 'border-pink-400',
  },
  {
    colorBg: 'bg-indigo-400',
    colorText: 'text-indigo-700',
    name: 'Indigo',
    border: 'border-indigo-400',
    color: 'bg-indigo-400'
  },
  {
    colorBg: 'bg-gray-400',
    colorText: 'text-gray-700',
    name: 'Grijs',
    border: 'border-gray-400',
  },
  {
    colorBg: 'bg-orange-400',
    colorText: 'text-orange-700',
    name: 'Oranje',
    border: 'border-orange-400',
  },
  {
    colorBg: 'bg-teal-400',
    colorText: 'text-teal-700',
    name: 'Teal',
    border: 'border-teal-400',
  }
] as const;

// Types voor autocomplete
export type ColorInternalName = typeof COLORS[number]['name'];

// Helper functies voor tags
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

// Helper functies voor columns
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
