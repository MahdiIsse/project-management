"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../shared/components/ui/breadcrumb";
import { Separator } from "../../../../shared/components/ui/separator";
import { SidebarTrigger } from "../../../../shared/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useWorkspaces } from "../../../workspace";

export function TopNavBar() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace");

  const { data: workspaces } = useWorkspaces();

  const activeWorkspace = workspaces?.find((w) => w.id === workspaceId);

  return (
    <header>
      <div className="flex items-center gap-2 p-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Workspaces</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{activeWorkspace?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
