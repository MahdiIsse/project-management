"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
  CheckSquare,
  BarChart2,
  Users,
} from "lucide-react";

import {
  NavMain,
  Workspaces,
  NavUser,
  TeamSwitcher,
} from "@/features/workspace";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared";

// Vervang de huidige complexe data met:
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "My Tasks",
      url: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      title: "Goals",
      url: "/dashboard/goals",
      icon: BarChart2,
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: Users,
    },
  ],
  // Remove projects array since we're using Workspaces component
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <Workspaces />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
