export const WORKSPACE_COLORS = [
  {
    name: "Oranje",
    bg: "bg-orange-500",
    icon: "text-orange-400",
    activeBg: "bg-orange-950",
    activeText: "text-orange-300",
  },
  {
    name: "Roze",
    bg: "bg-rose-500",
    icon: "text-rose-400",
    activeBg: "bg-rose-950",
    activeText: "text-rose-300",
  },
  {
    name: "Groen",
    bg: "bg-emerald-500",
    icon: "text-emerald-400",
    activeBg: "bg-emerald-950",
    activeText: "text-emerald-200",
  },
  {
    name: "Indigo",
    bg: "bg-indigo-500",
    icon: "text-indigo-400",
    activeBg: "bg-indigo-950",
    activeText: "text-indigo-300",
  },
  {
    name: "Leisteen",
    bg: "bg-slate-500",
    icon: "text-slate-400",
    activeBg: "bg-slate-900",
    activeText: "text-slate-300",
  },
  {
    name: "Blauw",
    bg: "bg-blue-500",
    icon: "text-blue-400",
    activeBg: "bg-blue-950",
    activeText: "text-blue-300",
  },
  {
    name: "Geel",
    bg: "bg-yellow-500",
    icon: "text-yellow-400",
    activeBg: "bg-yellow-900",
    activeText: "text-yellow-300",
  },
  {
    name: "Paars",
    bg: "bg-purple-500",
    icon: "text-purple-400",
    activeBg: "bg-purple-950",
    activeText: "text-purple-300",
  },
  {
    name: "Cyaan",
    bg: "bg-cyan-500",
    icon: "text-cyan-400",
    activeBg: "bg-cyan-950",
    activeText: "text-cyan-300",
  },
  {
    name: "Lime",
    bg: "bg-lime-500",
    icon: "text-lime-400",
    activeBg: "bg-lime-900",
    activeText: "text-lime-300",
  },
] as const;

export type WorkspaceColorName = (typeof WORKSPACE_COLORS)[number]["name"];

export function getWorkspaceColorProps(name: string | null | undefined) {
  const defaultColor = WORKSPACE_COLORS.find((c) => c.name === "Leisteen")!;
  if (!name) {
    return defaultColor;
  }
  const color = WORKSPACE_COLORS.find((c) => c.name === name);
  return color || defaultColor;
} 

export const getWorkspaceBorderClass = (colorName: string | undefined) => {
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
};