export const WORKSPACE_COLORS = [
  {
    name: "Orange",
    bg: "bg-orange-500",
    icon: "text-orange-400",
    activeBg: "bg-orange-950",
    activeText: "text-orange-300",
  },
  {
    name: "Rose",
    bg: "bg-rose-500",
    icon: "text-rose-400",
    activeBg: "bg-rose-950",
    activeText: "text-rose-300",
  },
  {
    name: "Green",
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
    name: "Slate",
    bg: "bg-slate-500",
    icon: "text-slate-400",
    activeBg: "bg-slate-900",
    activeText: "text-slate-300",
  },
] as const;

export type WorkspaceColorName = (typeof WORKSPACE_COLORS)[number]["name"];

export function getWorkspaceColorProps(name: string | null | undefined) {
  const defaultColor = WORKSPACE_COLORS.find((c) => c.name === "Slate")!;
  if (!name) {
    return defaultColor;
  }
  const color = WORKSPACE_COLORS.find((c) => c.name === name);
  return color || defaultColor;
} 