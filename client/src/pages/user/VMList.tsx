import * as React from "react";
import {
  Server,
  Play,
  Square,
  RotateCw,
  Terminal,
  Key,
  Trash2,
  MoreVertical,
  LayoutGrid,
  List,
  Filter,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Combobox } from "@/components/ui/combobox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function VMList({ isAdmin = false }: { isAdmin?: boolean }) {
  const [vms, setVMs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<string>("table");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [user, setUser] = React.useState<any>(null);

  // Deletion modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [vmToDelete, setVmToDelete] = React.useState<any>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Mobile Drawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerVM, setDrawerVM] = React.useState<any>(null);

  const loadData = async () => {
    try {
      const [authData, vmsData] = await Promise.all([
        api.checkAuth(),
        isAdmin ? api.getAdminVMs() : api.getVMs(),
      ]);
      if (authData.authenticated) {
        setUser(authData.user);
      }
      setVMs(vmsData || []);
    } catch (err: any) {
      toast({
        title: "Failed to Load Virtual Machines",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleStart = async (vmId: string | number) => {
    try {
      toast({ title: "Starting VM...", description: `Initializing VM ${vmId}` });
      await api.startVM(vmId);
      toast({ title: "VM Started", variant: "success" });
      loadData();
    } catch (err: any) {
      toast({ title: "Start Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleStop = async (vmId: string | number, force = false) => {
    try {
      toast({ title: "Stopping VM...", description: `Signaling shutdown for VM ${vmId}` });
      await api.stopVM(vmId, force);
      toast({ title: "VM Stopped", variant: "success" });
      loadData();
    } catch (err: any) {
      toast({ title: "Stop Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleRestart = async (vmId: string | number) => {
    try {
      toast({ title: "Restarting VM...", description: `Cycling power for VM ${vmId}` });
      await api.restartVM(vmId);
      toast({ title: "VM Restarted", variant: "success" });
      loadData();
    } catch (err: any) {
      toast({ title: "Restart Failed", description: err.message, variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!vmToDelete) return;
    setDeleting(true);
    try {
      await api.deleteVM(vmToDelete.vm_id);
      toast({
        title: "VM Deleted",
        description: `Instance ${vmToDelete.name || vmToDelete.vm_id} has been destroyed.`,
        variant: "success",
      });
      setDeleteDialogOpen(false);
      setVmToDelete(null);
      loadData();
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  // Filtered VMs
  const filteredVMs = vms.filter((vm) => {
    const matchesSearch =
      !searchQuery ||
      (vm.name && vm.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(vm.vm_id).includes(searchQuery) ||
      (vm.ip_address && vm.ip_address.includes(searchQuery));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "running" && vm.status === "running") ||
      (statusFilter === "stopped" && vm.status === "stopped");

    return matchesSearch && matchesStatus;
  });

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Virtual Machine",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-col min-w-0">
            <a
              href={`/vm/${row.vm_id}`}
              className="font-medium text-xs text-foreground hover:underline truncate"
            >
              {row.name || `vm-${row.vm_id}`}
            </a>
            <span className="text-[10px] text-muted-foreground font-mono">
              ID: {row.vm_id} • {row.os_type || "Generic Linux"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge
          variant={
            row.status === "running"
              ? "running"
              : row.status === "stopped"
              ? "stopped"
              : "error"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "hardware",
      header: "Resources",
      render: (row) => (
        <span className="text-[11px] font-mono text-muted-foreground">
          {row.cores || 1} vCPU • {row.memory || 1024} MB RAM
        </span>
      ),
    },
    {
      key: "networking",
      header: "Network / SSH",
      render: (row) => (
        <span className="text-[11px] font-mono text-muted-foreground">
          Port {row.ssh_port || 2222} {row.ip_address ? `(${row.ip_address})` : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => (window.location.href = `/vm/${row.vm_id}/console`)}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span className="sr-only">Console</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open Console</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => (window.location.href = `/vm/${row.vm_id}/ssh`)}
              >
                <Key className="h-3.5 w-3.5" />
                <span className="sr-only">Web SSH</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Web SSH</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.status !== "running" ? (
                <DropdownMenuItem onClick={() => handleStart(row.vm_id)}>
                  <Play className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                  <span>Start VM</span>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => handleStop(row.vm_id, false)}>
                    <Square className="mr-2 h-3.5 w-3.5 text-amber-400" />
                    <span>Graceful Shutdown</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRestart(row.vm_id)}>
                    <RotateCw className="mr-2 h-3.5 w-3.5" />
                    <span>Restart VM</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStop(row.vm_id, true)}>
                    <Square className="mr-2 h-3.5 w-3.5 text-destructive" />
                    <span>Force Stop</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setVmToDelete(row);
                  setDeleteDialogOpen(true);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                <span>Delete VM</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <AppShell
      breadcrumbs={[{ label: isAdmin ? "All Virtual Machines" : "My Virtual Machines" }]}
      user={user}
    >
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header with Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {isAdmin ? "Cluster Virtual Machines" : "My Virtual Machines"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage compute instances, console serial sessions, and hypervisor execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {user?.role === "admin" && (
              <Button
                size="sm"
                onClick={() => (window.location.href = "/admin/vm-create")}
                className="gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Deploy VM</span>
              </Button>
            )}

            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(val) => val && setViewMode(val)}
              className="border border-border rounded-md p-0.5"
            >
              <ToggleGroupItem value="table" size="sm" aria-label="Table view">
                <List className="h-3.5 w-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" size="sm" aria-label="Grid view">
                <LayoutGrid className="h-3.5 w-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Search by name, ID, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs h-8 text-xs"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Filter className="h-3 w-3" />
                <span>Status: {statusFilter.toUpperCase()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-1">
                <Button
                  variant={statusFilter === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-7"
                  onClick={() => setStatusFilter("all")}
                >
                  All Instances
                </Button>
                <Button
                  variant={statusFilter === "running" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-7"
                  onClick={() => setStatusFilter("running")}
                >
                  Running
                </Button>
                <Button
                  variant={statusFilter === "stopped" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-7"
                  onClick={() => setStatusFilter("stopped")}
                >
                  Stopped / Offline
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="text-xs text-muted-foreground ml-auto font-mono">
            {filteredVMs.length} instances
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filteredVMs.length === 0 ? (
          <Empty
            title="No Virtual Machines Found"
            description="No instances matched your current search and status filters."
            action={
              user?.role === "admin" ? (
                <Button
                  size="sm"
                  onClick={() => (window.location.href = "/admin/vm-create")}
                >
                  Create Virtual Machine
                </Button>
              ) : undefined
            }
          />
        ) : viewMode === "table" ? (
          <DataTable
            data={filteredVMs}
            columns={columns}
            pageSize={10}
            onRowClick={(row) => (window.location.href = `/vm/${row.vm_id}`)}
          />
        ) : (
          /* Grid View with Context Menu on Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVMs.map((vm) => (
              <ContextMenu key={vm.vm_id}>
                <ContextMenuTrigger>
                  <Card className="hover:border-border/80 transition-colors cursor-pointer h-full flex flex-col justify-between">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Server className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <CardTitle className="text-xs truncate">
                              {vm.name || `vm-${vm.vm_id}`}
                            </CardTitle>
                            <CardDescription className="text-[10px] font-mono">
                              ID: {vm.vm_id} • {vm.os_type || "Generic"}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={
                            vm.status === "running"
                              ? "running"
                              : vm.status === "stopped"
                              ? "stopped"
                              : "error"
                          }
                        >
                          {vm.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      <div className="text-[11px] font-mono text-muted-foreground space-y-1 bg-background/50 p-2 rounded-md border border-border/50">
                        <div>CPU: {vm.cores || 1} vCPU</div>
                        <div>RAM: {vm.memory || 1024} MB</div>
                        <div>SSH: Port {vm.ssh_port || 2222}</div>
                      </div>

                      <div className="flex items-center justify-between pt-1 gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] flex-1 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/vm/${vm.vm_id}/console`;
                          }}
                        >
                          <Terminal className="h-3 w-3" />
                          <span>Console</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] flex-1 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/vm/${vm.vm_id}/ssh`;
                          }}
                        >
                          <Key className="h-3 w-3" />
                          <span>SSH</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 text-[11px] px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/vm/${vm.vm_id}`;
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </ContextMenuTrigger>

                <ContextMenuContent>
                  {vm.status !== "running" ? (
                    <ContextMenuItem onClick={() => handleStart(vm.vm_id)}>
                      <Play className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                      <span>Start Instance</span>
                    </ContextMenuItem>
                  ) : (
                    <>
                      <ContextMenuItem onClick={() => handleStop(vm.vm_id, false)}>
                        <Square className="mr-2 h-3.5 w-3.5 text-amber-400" />
                        <span>Stop Instance</span>
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => handleRestart(vm.vm_id)}>
                        <RotateCw className="mr-2 h-3.5 w-3.5" />
                        <span>Restart</span>
                      </ContextMenuItem>
                    </>
                  )}
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => (window.location.href = `/vm/${vm.vm_id}/console`)}>
                    <Terminal className="mr-2 h-3.5 w-3.5" />
                    <span>Serial Console</span>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => (window.location.href = `/vm/${vm.vm_id}/ssh`)}>
                    <Key className="mr-2 h-3.5 w-3.5" />
                    <span>Web SSH</span>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => {
                      setVmToDelete(vm);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    <span>Destroy Instance</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}

        {/* Mobile Quick Actions Drawer */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{drawerVM?.name || `VM ${drawerVM?.vm_id}`}</DrawerTitle>
              <DrawerDescription>
                Quick operations and runtime parameters for mobile viewport
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-3">
              <div className="text-xs font-mono text-muted-foreground space-y-1">
                <div>Status: {drawerVM?.status}</div>
                <div>Hardware: {drawerVM?.cores || 1} vCPU • {drawerVM?.memory || 1024} MB RAM</div>
                <div>SSH Port: {drawerVM?.ssh_port || 2222}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = `/vm/${drawerVM?.vm_id}/console`)}
                >
                  Serial Console
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = `/vm/${drawerVM?.vm_id}/ssh`)}
                >
                  Web SSH
                </Button>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Destructive Deletion Alert Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Destroy Virtual Machine</AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure you want to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  {vmToDelete?.name || `VM ${vmToDelete?.vm_id}`}
                </span>
                ? This action cannot be undone and will permanently destroy the associated
                virtual disk image and configurations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Destroying..." : "Destroy Instance"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
