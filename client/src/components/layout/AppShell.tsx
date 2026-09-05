import * as React from "react";
import {
  Server,
  LayoutDashboard,
  Users,
  Settings,
  Layers,
  PlusCircle,
  User,
  LogOut,
  Menu,
  Search,
  ExternalLink,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const currentPath = window.location.pathname;

  const isAdmin = user?.role === "admin" || currentPath.startsWith("/admin");

  // Global Ctrl+K / Cmd+K listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  const navLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard, adminOnly: false },
    { label: "My Virtual Machines", href: "/vms", icon: Server, adminOnly: false },
  ];

  const adminLinks = [
    { label: "Cluster Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Deploy Instance", href: "/admin/vm-create", icon: PlusCircle },
    { label: "All Virtual Machines", href: "/admin/vms", icon: Server },
    { label: "User Accounts", href: "/admin/users", icon: Users },
    { label: "OS Templates & ISO", href: "/admin/templates", icon: Layers },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  const renderNavContent = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>User Space</SidebarGroupLabel>
        <SidebarMenu>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton href={item.href} active={active}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      {isAdmin && (
        <SidebarGroup>
          <SidebarGroupLabel>Hypervisor Admin</SidebarGroupLabel>
          <SidebarMenu>
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton href={item.href} active={active}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full shrink-0">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono font-bold text-xs">
                  KM
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-semibold tracking-tight text-foreground">
                    KineticMesh
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    VPS Control Plane
                  </span>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>{renderNavContent()}</SidebarContent>

            <SidebarFooter>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-6 w-6">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} />
                    ) : (
                      <AvatarFallback>
                        {user?.username?.substring(0, 2).toUpperCase() || "KM"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 truncate">
                    <p className="truncate font-medium text-[11px] leading-tight text-foreground">
                      {user?.username || "Operator"}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground capitalize">
                      {user?.role || "User"}
                    </p>
                  </div>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="sr-only">Sign out</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign out</TooltipContent>
                </Tooltip>
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-xs">
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Drawer Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="p-4 border-b border-border">
                    <SheetTitle className="text-xs font-semibold flex items-center gap-2">
                      <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-mono">
                        KM
                      </span>
                      KineticMesh Control Plane
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-3 space-y-4">{renderNavContent()}</div>
                </SheetContent>
              </Sheet>

              {/* Breadcrumb */}
              <Breadcrumb className="hidden sm:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">KineticMesh</BreadcrumbLink>
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

            {/* Center: Navigation Menu Quick Switcher */}
            <div className="hidden lg:flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-xs h-7">
                      Quick Access
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[320px] gap-2 p-3">
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              href="/vms"
                              className="block select-none space-y-1 rounded-md p-2 text-xs leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                <Server className="h-3.5 w-3.5" /> Virtual Machines
                              </div>
                              <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                Manage and monitor running instances.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        {isAdmin && (
                          <li>
                            <NavigationMenuLink asChild>
                              <a
                                href="/admin/vm-create"
                                className="block select-none space-y-1 rounded-md p-2 text-xs leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="font-semibold text-foreground flex items-center gap-1.5">
                                  <PlusCircle className="h-3.5 w-3.5" /> Deploy New Instance
                                </div>
                                <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                  5-step guided provisioning wizard.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        )}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right: Search / Command Palette & User Profile */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandOpen(true)}
                className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground h-7 px-2.5 font-normal"
              >
                <Search className="h-3 w-3" />
                <span>Search control plane...</span>
                <Kbd className="ml-2">Ctrl K</Kbd>
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

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="rounded-full">
                    <Avatar className="h-7 w-7">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar} />
                      ) : (
                        <AvatarFallback>
                          {user?.username?.substring(0, 2).toUpperCase() || "KM"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-foreground">
                        {user?.username || "Operator"}
                      </span>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        Role: {user?.role || "User"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>
                    <User className="mr-2 h-3.5 w-3.5" />
                    <span>Profile & Security</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => (window.location.href = "/admin/settings")}>
                      <Settings className="mr-2 h-3.5 w-3.5" />
                      <span>System Settings</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>

        {/* Global Command Palette */}
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          isAdmin={isAdmin}
        />

        {/* Global Toaster */}
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
