"use client";

import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Workspaces() {
  const { isMobile } = useSidebar();
  const { data: workspaces } = useWorkspaces();

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentWorkspace = searchParams.get("workspace");

  const handleWorkspaceChange = (workspaceId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("workspace", workspaceId);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {workspaces?.map((workspace) => (
          <SidebarMenuItem key={workspace.id}>
            <SidebarMenuButton asChild>
              <Button
                variant="outline"
                onClick={() => handleWorkspaceChange(workspace.id)}
                className={currentWorkspace === workspace.id ? "active" : ""}
              >
                {workspace.title}
              </Button>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
