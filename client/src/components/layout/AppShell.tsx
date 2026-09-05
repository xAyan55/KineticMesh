import * as React from "react";
import { SideBar } from "@/components/theme/SideBar";
import { NavigationBar } from "@/components/theme/NavigationBar";
import { PageContentBlock } from "@/components/theme/elements/PageContentBlock";
import { Toaster } from "@/components/ui/toast";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

export interface AppShellProps {
  breadcrumbs?: BreadcrumbCrumb[];
  user?: {
    username: string;
    role: string;
    avatar?: string;
  };
  children: React.ReactNode;
}

export function AppShell({ breadcrumbs = [], children }: AppShellProps) {
  const title = breadcrumbs[breadcrumbs.length - 1]?.label || "KineticMesh Control Plane";

  return (
    <div className="min-h-screen flex h-full bg-gray-800" style={{ backgroundImage: "var(--image)" }}>
      <SideBar />
      <div className="w-full flex-1 flex flex-col min-w-0">
        <NavigationBar />
        <PageContentBlock title={title}>
          {children}
        </PageContentBlock>
      </div>
      <Toaster />
    </div>
  );
}

export default AppShell;
