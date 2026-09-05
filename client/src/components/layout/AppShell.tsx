import * as React from "react";
import {
  Server,
  LayoutDashboard,
  Users,
  Settings,
  Layers,
  PlusCircle,
  LogOut,
  Search,
  Terminal,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  FolderKanban,
  Hash,
  Menu,
  Shield,
  ExternalLink,
} from "lucide-react";
import {
  WorkspaceSwitcher,
  NavItem,
  NavItemData,
  NavGroupData,
} from "@/components/ui/dashboard-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { api } from "@/lib/api";

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

export function AppShell({ breadcrumbs = [], user, children }: AppShellProps) {
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeWorkspace, setActiveWorkspace] = React.useState("KineticMesh Local KVM");
  const currentPath = window.location.pathname;

  const isAdmin = user?.role === "admin" || currentPath.startsWith("/admin");

  // Global Ctrl+K / Cmd+K listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (e.key === "," && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        navigate(isAdmin ? "/admin/settings" : "/profile");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await api.logout();
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  const navigate = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Nav Groups configuration
  const navGroups: NavGroupData[] = [
    {
      items: [
        { id: "search", title: "Quick Search", icon: Search, shortcut: "⌘K" },
        { id: "overview", title: "User Overview", icon: LayoutDashboard, href: "/dashboard" },
      ],
    },
    {
      heading: "Fleet Management",
      items: [
        {
          id: "vms",
          title: "Virtual Machines",
          icon: Server,
          href: isAdmin ? "/admin/vms" : "/vms",
          children: [
            { id: "vms-list", title: "Active Instances", icon: Hash, href: isAdmin ? "/admin/vms" : "/vms" },
            { id: "vms-deploy", title: "Deploy Instance", icon: PlusCircle, href: "/admin/vm-create" },
          ],
        },
        {
          id: "ssh-terminal",
          title: "Web SSH Console",
          icon: Terminal,
          href: isAdmin ? "/admin/vms" : "/vms",
        },
      ],
    },
  ];

  if (isAdmin) {
    navGroups.push({
      heading: "Hypervisor Control",
      items: [
        { id: "admin-dashboard", title: "Cluster Overview", icon: Activity, href: "/admin/dashboard", badge: "Live" },
        { id: "admin-deploy", title: "Deploy Instance", icon: PlusCircle, href: "/admin/vm-create" },
        { id: "admin-users", title: "User Accounts", icon: Users, href: "/admin/users" },
        { id: "admin-templates", title: "OS Templates & ISO", icon: Layers, href: "/admin/templates" },
        { id: "admin-settings", title: "Hypervisor Settings", icon: Settings, href: "/admin/settings" },
      ],
    });
  }

  const bottomItems: NavItemData[] = [
    { id: "settings", title: "Settings", icon: Settings, shortcut: "⌘,", href: isAdmin ? "/admin/settings" : "/profile" },
    { id: "logout", title: "Sign out", icon: LogOut },
  ];

  // Determine current active item ID based on currentPath
  const findActiveId = (): string => {
    if (currentPath === "/dashboard") return "overview";
    if (currentPath === "/admin/dashboard") return "admin-dashboard";
    if (currentPath === "/admin/vm-create") return "admin-deploy";
    if (currentPath === "/admin/users") return "admin-users";
    if (currentPath === "/admin/templates") return "admin-templates";
    if (currentPath === "/admin/settings") return "admin-settings";
    if (currentPath.startsWith("/vms") || currentPath.startsWith("/admin/vms") || currentPath.startsWith("/vm/")) return "vms";
    if (currentPath === "/profile") return "settings";
    return "overview";
  };

  const activeId = findActiveId();

  const handleNavSelect = (id: string) => {
    if (id === "search") {
      setCommandOpen(true);
      return;
    }
    if (id === "logout") {
      handleLogout();
      return;
    }

    // Search flat items for href
    const all = [...navGroups.flatMap((g) => g.items), ...bottomItems];
    const findHref = (items: NavItemData[]): string | undefined => {
      for (const item of items) {
        if (item.id === id) return item.href;
        if (item.children) {
          const childHref = findHref(item.children);
          if (childHref) return childHref;
        }
      }
      return undefined;
    };

    const targetHref = findHref(all);
    if (targetHref) {
      navigate(targetHref);
      setMobileOpen(false);
    }
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-card/60 border-r border-border/50 p-3 font-sans w-[260px]">
      <WorkspaceSwitcher
        selected={activeWorkspace}
        onSelect={setActiveWorkspace}
        workspaces={["KineticMesh Local KVM", "Cluster Alpha (Remote)", "Dev Sandbox"]}
        plan={isAdmin ? "Pro Hypervisor" : "KVM User Space"}
      />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="px-2.5 mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground/50 uppercase">
                {group.heading}
              </span>
            )}
            {group.items.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                activeId={activeId}
                onSelect={handleNavSelect}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-0.5">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            activeId={activeId}
            onSelect={handleNavSelect}
          />
        ))}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        {/* Desktop Collapsible Sidebar */}
        <div
          className={`hidden md:flex h-full shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            sidebarOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 border-none"
          }`}
        >
          {renderSidebarContent()}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
          {/* Topbar */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-card/60 px-4 backdrop-blur-xs">
            {/* Left: Sidebar Toggle, Mobile Drawer & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Desktop Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                className="hidden md:flex p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} />
                ) : (
                  <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />
                )}
              </button>

              {/* Mobile Drawer Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0 border-r border-border">
                  {renderSidebarContent()}
                </SheetContent>
              </Sheet>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="truncate max-w-[140px] font-medium text-foreground">
                  {activeWorkspace}
                </span>
                <span>/</span>
                <Breadcrumb className="hidden sm:flex">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                        {isAdmin ? "Control Plane" : "KineticMesh"}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbs.map((crumb, idx) => (
                      <React.Fragment key={crumb.label + idx}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {crumb.href && idx < breadcrumbs.length - 1 ? (
                            <BreadcrumbLink href={crumb.href}>
                              {crumb.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            {/* Right: Search / Command Palette & User Profile */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandOpen(true)}
                className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground h-8 px-3 font-normal bg-background/50 border-border/50 hover:bg-accent"
              >
                <Search className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>Search control plane...</span>
                <Kbd className="ml-2">⌘K</Kbd>
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setCommandOpen(true)}
                className="sm:hidden"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>

              <Separator orientation="vertical" className="h-4 hidden sm:block" />

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8 rounded-full border border-primary/20">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} />
                  ) : (
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {user?.username?.substring(0, 2).toUpperCase() || "KM"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-medium leading-none text-foreground">
                    {user?.username || "Operator"}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize mt-0.5">
                    {user?.role || "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Body Viewport */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </main>
        </div>

        {/* Global Command Palette */}
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
