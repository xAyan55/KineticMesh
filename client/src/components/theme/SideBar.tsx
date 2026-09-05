import React, { useState } from "react";
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
  Power,
  Globe,
  Hash,
} from "lucide-react";
import {
  WorkspaceSwitcher,
  NavItem,
  NavItemData,
  NavGroupData,
} from "@/components/ui/dashboard-sidebar";
import { PowerButtons } from "./server/PowerButtons";
import { api } from "@/lib/api";

interface SideBarProps {
  currentVm?: {
    id: string | number;
    name: string;
    status: string;
    ip?: string;
  };
  children?: React.ReactNode;
}

export const SideBar: React.FC<SideBarProps> = ({ currentVm, children }) => {
  const pathname = window.location.pathname;
  const initialData = (window as any).__INITIAL_DATA__ || {};
  const user = initialData.user || { username: "Administrator", role: "admin" };
  const isAdmin = user.role === "admin";
  const [activeWorkspace, setActiveWorkspace] = useState("KineticMesh Local KVM");

  const navigate = (url: string) => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  // Build nav groups based on context
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
          href: "/vms",
          children: [
            { id: "vms-list", title: "Active Instances", icon: Hash, href: "/vms" },
            { id: "vms-deploy", title: "Deploy Instance", icon: PlusCircle, href: "/admin/vm-create" },
          ],
        },
        {
          id: "ssh-terminal",
          title: "Web SSH Console",
          icon: Terminal,
          href: "/vms",
        },
      ],
    },
  ];

  if (currentVm) {
    navGroups.push({
      heading: `Active: ${currentVm.name}`,
      items: [
        { id: `vm-overview`, title: "Instance Overview", icon: Server, href: `/vm/${currentVm.id}` },
        { id: `vm-console`, title: "Serial Console", icon: Terminal, href: `/vm/${currentVm.id}/console` },
        { id: `vm-ssh`, title: "Web SSH Terminal", icon: Terminal, href: `/vm/${currentVm.id}/ssh` },
      ],
    });
  }

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

  const findActiveId = (): string => {
    if (currentVm) {
      if (pathname.endsWith("/console")) return "vm-console";
      if (pathname.endsWith("/ssh")) return "vm-ssh";
      return "vm-overview";
    }
    if (pathname === "/dashboard") return "overview";
    if (pathname === "/admin/dashboard") return "admin-dashboard";
    if (pathname === "/admin/vm-create") return "admin-deploy";
    if (pathname === "/admin/users") return "admin-users";
    if (pathname === "/admin/templates") return "admin-templates";
    if (pathname === "/admin/settings") return "admin-settings";
    if (pathname.startsWith("/vms") || pathname.startsWith("/admin/vms")) return "vms";
    if (pathname === "/profile") return "settings";
    return "overview";
  };

  const activeId = findActiveId();

  const handleNavSelect = (id: string) => {
    if (id === "search") {
      // Trigger global search palette event
      const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
      document.dispatchEvent(event);
      return;
    }
    if (id === "logout") {
      handleLogout();
      return;
    }

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
    }
  };

  return (
    <aside className="w-[260px] flex-shrink-0 h-screen hidden md:flex flex-col sticky top-0 z-30 font-sans">
      <div className="flex flex-col w-full h-full bg-card/60 border-r border-border/50 p-3">
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

          {currentVm && (
            <div className="mt-2 p-2.5 bg-background/50 rounded-lg border border-border/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground truncate">{currentVm.name}</span>
                <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono uppercase ${
                  currentVm.status === "running" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}>
                  {currentVm.status}
                </span>
              </div>
              <PowerButtons vmId={currentVm.id} status={currentVm.status} icons />
            </div>
          )}

          {children}
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
    </aside>
  );
};

export default SideBar;
