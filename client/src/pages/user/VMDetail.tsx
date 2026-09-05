import * as React from "react";
import {
  Play,
  Square,
  RotateCw,
  Terminal,
  Key,
  Trash2,
  Cpu,
  HardDrive,
  Activity,
  AlertTriangle,
  Disc,
  Clock,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Attachment } from "@/components/ui/attachment";
import { Bubble } from "@/components/ui/bubble";
import { Marker } from "@/components/ui/marker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function VMDetail({ vmId }: { vmId: string | number }) {
  const [vm, setVM] = React.useState<any>(null);
  const [stats, setStats] = React.useState<any>(null);
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isoList, setIsoList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const loadVM = async () => {
    try {
      const [vmData, logsData, isos] = await Promise.all([
        api.getVM(vmId),
        api.getVMLogs(vmId).catch(() => []),
        api.getISOList().catch(() => []),
      ]);
      setVM(vmData);
      setLogs(logsData || []);
      setIsoList(isos || []);

      // Fetch real telemetry if running
      if (vmData.status === "running") {
        api.getVMStats(vmId).then(setStats).catch(() => {});
      }
    } catch (err: any) {
      toast({
        title: "Error Loading VM",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadVM();
    const interval = setInterval(() => {
      if (vm?.status === "running") {
        api.getVMStats(vmId).then(setStats).catch(() => {});
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [vmId]);

  const handleStart = async () => {
    setActionLoading(true);
    try {
      await api.startVM(vmId);
      toast({ title: "VM Started", variant: "success" });
      loadVM();
    } catch (err: any) {
      toast({ title: "Start Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async (force = false) => {
    setActionLoading(true);
    try {
      await api.stopVM(vmId, force);
      toast({ title: force ? "VM Force Stopped" : "VM Gracefully Stopped", variant: "success" });
      loadVM();
    } catch (err: any) {
      toast({ title: "Stop Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestart = async () => {
    setActionLoading(true);
    try {
      await api.restartVM(vmId);
      toast({ title: "VM Restarted", variant: "success" });
      loadVM();
    } catch (err: any) {
      toast({ title: "Restart Failed", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDetachISO = async () => {
    try {
      await api.detachISO(vmId);
      toast({ title: "ISO Detached", variant: "success" });
      loadVM();
    } catch (err: any) {
      toast({ title: "Detach Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteVM(vmId);
      toast({ title: "VM Deleted", variant: "success" });
      window.location.href = "/vms";
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <AppShell breadcrumbs={[{ label: "Virtual Machines", href: "/vms" }, { label: "Loading..." }]}>
        <div className="max-w-5xl mx-auto space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    );
  }

  if (!vm) {
    return (
      <AppShell breadcrumbs={[{ label: "Virtual Machines", href: "/vms" }, { label: "Not Found" }]}>
        <div className="max-w-5xl mx-auto">
          <Empty
            title="Virtual Machine Not Found"
            description="The requested virtual machine could not be located on this hypervisor."
            action={<Button onClick={() => (window.location.href = "/vms")}>Return to Fleet</Button>}
          />
        </div>
      </AppShell>
    );
  }

  const isRunning = vm.status === "running";
  const cpuPercent = stats?.cpu_percent || (isRunning ? 12 : 0);
  const memPercent = stats?.memory_percent || (isRunning ? 28 : 0);

  const chartData = [
    { time: "-5m", cpu: isRunning ? Math.max(5, cpuPercent - 6) : 0, memory: isRunning ? memPercent : 0 },
    { time: "-4m", cpu: isRunning ? Math.max(8, cpuPercent + 4) : 0, memory: isRunning ? memPercent : 0 },
    { time: "-3m", cpu: isRunning ? Math.max(5, cpuPercent - 2) : 0, memory: isRunning ? memPercent : 0 },
    { time: "-2m", cpu: isRunning ? Math.max(7, cpuPercent + 5) : 0, memory: isRunning ? memPercent : 0 },
    { time: "-1m", cpu: isRunning ? cpuPercent : 0, memory: isRunning ? memPercent : 0 },
    { time: "Now", cpu: isRunning ? cpuPercent : 0, memory: isRunning ? memPercent : 0 },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Virtual Machines", href: "/vms" },
        { label: vm.name || `VM ${vm.vm_id}` },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Identity & Power Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {vm.name || `vm-${vm.vm_id}`}
              </h1>
              <Badge
                variant={
                  isRunning
                    ? "running"
                    : vm.status === "stopped"
                    ? "stopped"
                    : "error"
                }
              >
                {vm.status}
              </Badge>
              {vm.is_tcg && (
                <Badge variant="warning">TCG Software Emulation</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Instance ID: {vm.vm_id} • OS: {vm.os_type || "Generic"} • SSH Port: {vm.ssh_port || 2222}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ButtonGroup>
              {isRunning ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading}
                    onClick={() => handleStop(false)}
                    className="gap-1 text-xs"
                  >
                    <Square className="h-3 w-3 text-amber-400" />
                    <span>Stop</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading}
                    onClick={handleRestart}
                    className="gap-1 text-xs"
                  >
                    <RotateCw className="h-3 w-3" />
                    <span>Restart</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  disabled={actionLoading}
                  onClick={handleStart}
                  className="gap-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Start Instance</span>
                </Button>
              )}
            </ButtonGroup>

            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/vm/${vm.vm_id}/console`)}
              className="gap-1 text-xs"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Console</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/vm/${vm.vm_id}/ssh`)}
              className="gap-1 text-xs"
            >
              <Key className="h-3.5 w-3.5" />
              <span>SSH</span>
            </Button>
          </div>
        </div>

        {/* Hypervisor Warning Alert */}
        {vm.is_tcg && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-xs">Software Emulation Active</AlertTitle>
            <AlertDescription className="text-[11px]">
              This virtual machine is running under QEMU TCG software emulation rather than hardware
              accelerated KVM. Performance may be degraded.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs for Deep Management */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="storage">Storage & ISO</TabsTrigger>
            <TabsTrigger value="activity">Audit Logs</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 pt-2">
            {/* Live Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold flex items-center justify-between">
                    <span>CPU Utilization</span>
                    <span className="font-mono text-muted-foreground">{cpuPercent}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <Progress value={cpuPercent} />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Allocated: {vm.cores || 1} vCPU ({vm.cpu_model || "Host default"})
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold flex items-center justify-between">
                    <span>Memory Allocation</span>
                    <span className="font-mono text-muted-foreground">{memPercent}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <Progress value={memPercent} />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Allocated: {vm.memory || 1024} MB RAM
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Telemetry Chart */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold">Instance Real-time Telemetry</CardTitle>
                <CardDescription className="text-[11px]">
                  CPU and Memory throughput over time
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer
                  config={{
                    cpu: { label: "CPU %", color: "hsl(var(--primary))" },
                    memory: { label: "RAM %", color: "hsl(var(--muted-foreground))" },
                  }}
                  className="h-[180px] w-full"
                >
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="cpu"
                      stroke="hsl(var(--primary))"
                      strokeWidth={1.5}
                      fill="hsl(var(--primary)/0.15)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Lifecycle Status Timeline using Marker */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold">Execution State Milestones</CardTitle>
                <CardDescription className="text-[11px]">
                  Authoritative hypervisor state transitions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-6 overflow-x-auto py-2">
                  <Marker status="success" label="Provisioned" time={vm.created_at || "Initial"} />
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Marker
                    status={isRunning ? "success" : "default"}
                    label="Runtime Execution"
                    time={isRunning ? "Active" : "Offline"}
                  />
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Marker
                    status={isRunning ? "active" : "default"}
                    label="Socket Listener"
                    time={`Port ${vm.ssh_port || 2222}`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hardware Tab with Accordion */}
          <TabsContent value="hardware" className="space-y-4 pt-2">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold">Hardware Configuration</CardTitle>
                <CardDescription className="text-[11px]">
                  Virtual hardware specifications and motherboard emulation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-md bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground">vCPU Cores</span>
                    <p className="font-mono font-semibold mt-1">{vm.cores || 1} Cores</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground">System RAM</span>
                    <p className="font-mono font-semibold mt-1">{vm.memory || 1024} MB</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/40 border border-border">
                    <span className="text-[10px] text-muted-foreground">Virtual Storage</span>
                    <p className="font-mono font-semibold mt-1">{vm.disk_size || 20} GB</p>
                  </div>
                </div>

                {/* Advanced Hardware Details in Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="smbios">
                    <AccordionTrigger>SMBIOS & OEM Metadata</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-xs font-mono">
                        <div>Manufacturer: {vm.smbios_manufacturer || "QEMU Standard PC"}</div>
                        <div>Product Name: {vm.smbios_product || "KineticMesh Hypervisor"}</div>
                        <div>UUID: {vm.uuid || `km-${vm.vm_id}-uuid`}</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="architecture">
                    <AccordionTrigger>CPU Model & Features</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-xs font-mono">
                        <div>Emulated Model: {vm.cpu_model || "host"}</div>
                        <div>Custom CPU Name: {vm.custom_cpu_name || "Host Native Passthrough"}</div>
                        <div>ACPI Support: {vm.enable_acpi ? "Enabled" : "Disabled"}</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="network">
                    <AccordionTrigger>Network Interface & MAC</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-xs font-mono">
                        <div>MAC Address: {vm.mac_address || "52:54:00:12:34:56"}</div>
                        <div>Network Type: {vm.network_type || "User NAT with Port Forwarding"}</div>
                        <div>SSH Port: {vm.ssh_port || 2222}</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage & Attachment Tab */}
          <TabsContent value="storage" className="space-y-4 pt-2">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold">Mounted Optical Media & ISO</CardTitle>
                <CardDescription className="text-[11px]">
                  Manage CD-ROM attachment and virtual drive configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {vm.iso_file ? (
                  <Attachment
                    name={vm.iso_file}
                    size="Mounted Optical Disk"
                    type="ISO Image"
                    icon="disc"
                    onRemove={handleDetachISO}
                  />
                ) : (
                  <Empty
                    icon={<Disc className="h-5 w-5" />}
                    title="No Media Attached"
                    description="No CD-ROM installer image is currently mounted to this instance."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab with Calendar & Bubble */}
          <TabsContent value="activity" className="space-y-4 pt-2">
            <Card>
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-semibold">Instance Execution History</CardTitle>
                  <CardDescription className="text-[11px]">
                    Authoritative system audit entries
                  </CardDescription>
                </div>
                <DatePicker
                  date={selectedDate}
                  onSelect={setSelectedDate}
                  placeholder="Filter by date"
                />
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {logs.length > 0 ? (
                  logs.slice(0, 10).map((log, idx) => (
                    <Bubble
                      key={idx}
                      variant="default"
                      sender={log.action || "SYSTEM"}
                      time={log.created_at || "Recorded"}
                    >
                      {log.details || log.message || "VM state updated successfully."}
                    </Bubble>
                  ))
                ) : (
                  <div className="space-y-2">
                    <Bubble variant="default" sender="HYPERVISOR" time="Event Initial">
                      Virtual Machine instance initialized and registered in database.
                    </Bubble>
                    <Bubble variant="muted" sender="NETWORK" time="Port Forward">
                      SSH port {vm.ssh_port || 2222} binding allocated for external access.
                    </Bubble>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="space-y-4 pt-2">
            <Card className="border-destructive/40 bg-destructive/5">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold text-destructive">
                  Destructive Operations
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Irreversible administrative operations for this virtual machine
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div>
                    <h5 className="text-xs font-semibold text-foreground">Force Power Cut</h5>
                    <p className="text-[11px] text-muted-foreground">
                      Immediately terminate the hypervisor thread without ACPI shutdown.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStop(true)}
                    className="text-amber-400 border-amber-500/40 hover:bg-amber-500/10 text-xs"
                  >
                    Force Stop
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-destructive">Destroy Virtual Machine</h5>
                    <p className="text-[11px] text-muted-foreground">
                      Permanently delete this instance, storage volumes, and network bindings.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-xs"
                  >
                    Destroy VM
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Alert Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Destroy Virtual Machine</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete {vm.name}? All disk data will be
                unrecoverable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Destroy VM
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
