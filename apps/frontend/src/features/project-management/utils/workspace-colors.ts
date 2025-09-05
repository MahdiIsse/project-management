export const WORKSPACE_COLORS = [
  {
    name: "Oranje",
    hex: "#F97316",
    bg: "bg-orange-500",
    icon: "text-orange-400",
    activeBg: "bg-orange-950",
    activeText: "text-orange-300",
  },
  {
    name: "Roze",
    hex: "#F43F5E",
    bg: "bg-rose-500",
    icon: "text-rose-400",
    activeBg: "bg-rose-950",
    activeText: "text-rose-300",
  },
  {
    name: "Groen",
    hex: "#10B981",
    bg: "bg-emerald-500",
    icon: "text-emerald-400",
    activeBg: "bg-emerald-950",
    activeText: "text-emerald-200",
  },
  {
    name: "Indigo",
    hex: "#6366F1",
    bg: "bg-indigo-500",
    icon: "text-indigo-400",
    activeBg: "bg-indigo-950",
    activeText: "text-indigo-300",
  },
  {
    name: "Leisteen",
    hex: "#64748B",
    bg: "bg-slate-500",
    icon: "text-slate-400",
    activeBg: "bg-slate-900",
    activeText: "text-slate-300",
  },
  {
    name: "Blauw",
    hex: "#3B82F6",
    bg: "bg-blue-500",
    icon: "text-blue-400",
    activeBg: "bg-blue-950",
    activeText: "text-blue-300",
  },
  {
    name: "Geel",
    hex: "#EAB308",
    bg: "bg-yellow-500",
    icon: "text-yellow-400",
    activeBg: "bg-yellow-900",
    activeText: "text-yellow-300",
  },
  {
    name: "Paars",
    hex: "#A855F7",
    bg: "bg-purple-500",
    icon: "text-purple-400",
    activeBg: "bg-purple-950",
    activeText: "text-purple-300",
  },
  {
    name: "Cyaan",
    hex: "#06B6D4",
    bg: "bg-cyan-500",
    icon: "text-cyan-400",
    activeBg: "bg-cyan-950",
    activeText: "text-cyan-300",
  },
  {
    name: "Lime",
    hex: "#84CC16",
    bg: "bg-lime-500",
    icon: "text-lime-400",
    activeBg: "bg-lime-900",
    activeText: "text-lime-300",
  },
] as const;

export type WorkspaceColorName = (typeof WORKSPACE_COLORS)[number]["name"];

export type WorkspaceColor = {
  name: string;
  hex: string;
  bg: string;
  icon: string;
  activeBg: string;
  activeText: string;
};

export function getWorkspaceColorByHex(hex: string | null | undefined): WorkspaceColor {
  const defaultColor = WORKSPACE_COLORS.find((c) => c.name === "Leisteen")!;
  
  if (!hex) {
    return defaultColor;
  }
  
  const color = WORKSPACE_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return color || {
    name: "Custom",
    hex: hex,
    bg: "bg-gray-500",
    icon: "text-gray-400", 
    activeBg: "bg-gray-900",
    activeText: "text-gray-300",
  };
}

export function getHexByWorkspaceColorName(name: string): string {
  const color = WORKSPACE_COLORS.find((c) => c.name === name);
  return color?.hex || "#64748B";
}

export function getWorkspaceColorProps(name: string | null | undefined) {
  const defaultColor = WORKSPACE_COLORS.find((c) => c.name === "Leisteen")!;
  if (!name) {
    return defaultColor;
  }
  const color = WORKSPACE_COLORS.find((c) => c.name === name);
  return color || defaultColor;
} 

export const getWorkspaceBorderClass = (colorIdentifier: string | undefined) => {
  if (colorIdentifier?.startsWith("#")) {
    const colorByHex = getWorkspaceColorByHex(colorIdentifier);
    return getWorkspaceBorderClassByName(colorByHex.name);
  }
  
  return getWorkspaceBorderClassByName(colorIdentifier);
};

function getWorkspaceBorderClassByName(colorName: string | undefined): string {
  switch (colorName) {
    case "Oranje": return "border-l-orange-500";
    case "Roze": return "border-l-rose-500";
    case "Groen": return "border-l-emerald-500";
    case "Indigo": return "border-l-indigo-500";
    case "Leisteen": return "border-l-slate-500";
    case "Blauw": return "border-l-blue-500";
    case "Geel": return "border-l-yellow-500";
    case "Paars": return "border-l-purple-500";
    case "Cyaan": return "border-l-cyan-500";
    case "Lime": return "border-l-lime-500";
    default: return "border-l-slate-500";
  }
}