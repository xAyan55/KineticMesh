import * as React from "react";
import {
  Server,
  PlusCircle,
  Users,
  Settings,
  Layers,
  Terminal,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { api } from "@/lib/api";

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

export function CommandPalette({ open, onOpenChange, isAdmin }: CommandPaletteProps) {
  const [vms, setVMs] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (open) {
      api.getVMs().then(setVMs).catch(() => {});
    }
  }, [open]);

  const navigate = (path: string) => {
    window.location.href = path;
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search virtual machines..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>User Dashboard</span>
            <CommandShortcut><Kbd>G</Kbd> <Kbd>D</Kbd></CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate("/vms")}>
            <Server className="mr-2 h-4 w-4" />
            <span>My Virtual Machines</span>
            <CommandShortcut><Kbd>G</Kbd> <Kbd>V</Kbd></CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile & Security</span>
          </CommandItem>
        </CommandGroup>

        {isAdmin && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Admin Operations">
              <CommandItem onSelect={() => navigate("/admin/dashboard")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Overview</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate("/admin/vm-create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Deploy Virtual Machine</span>
                <CommandShortcut><Kbd>N</Kbd></CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => navigate("/admin/vms")}>
                <Server className="mr-2 h-4 w-4" />
                <span>All Virtual Machines</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate("/admin/users")}>
                <Users className="mr-2 h-4 w-4" />
                <span>User Accounts</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate("/admin/templates")}>
                <Layers className="mr-2 h-4 w-4" />
                <span>OS Templates & ISO</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>System Settings</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {vms.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Active Virtual Machines">
              {vms.slice(0, 8).map((vm) => (
                <CommandItem
                  key={vm.vm_id}
                  onSelect={() => navigate(`/vm/${vm.vm_id}`)}
                >
                  <Server className="mr-2 h-3.5 w-3.5 opacity-70" />
                  <span className="font-medium">{vm.name || `VM ${vm.vm_id}`}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground font-mono">
                    ({vm.os_type || "Generic"} • {vm.status})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Session">
          <CommandItem
            onSelect={async () => {
              try {
                await api.logout();
                window.location.href = "/login";
              } catch {
                window.location.href = "/login";
              }
            }}
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
