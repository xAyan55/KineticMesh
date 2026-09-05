import * as React from "react";
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Users,
  PlusCircle,
  RotateCw,
  Sliders,
  Layers,
  HelpCircle,
  Database,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [vms, setVMs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  const loadData = async () => {
    try {
      const [authData, statsData, vmsData] = await Promise.all([
        api.checkAuth(),
        api.getAdminStats().catch(() => null),
        api.getAdminVMs().catch(() => []),
      ]);
      if (authData.authenticated) {
        setUser(authData.user);
      }
      setStats(statsData);
      setVMs(vmsData || []);
    } catch (err: any) {
      toast({
        title: "Error Loading Admin Dashboard",
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

  const runningVMs = vms.filter((v) => v.status === "running").length;
  const stoppedVMs = vms.filter((v) => v.status !== "running").length;
  const totalCores = vms.reduce((acc, v) => acc + (parseInt(v.cores) || 1), 0);
  const totalMemoryMB = vms.reduce((acc, v) => acc + (parseInt(v.memory) || 1024), 0);

  const chartData = [
    { time: "00:00", cpu: 18, memory: 35 },
    { time: "04:00", cpu: 22, memory: 38 },
    { time: "08:00", cpu: 34, memory: 45 },
    { time: "12:00", cpu: 48, memory: 52 },
    { time: "16:00", cpu: 42, memory: 49 },
    { time: "20:00", cpu: 28, memory: 40 },
  ];

  return (
    <AppShell breadcrumbs={[{ label: "Admin Cluster Overview" }]} user={user}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top Desktop Menubar */}
        <div className="flex items-center justify-between">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Cluster</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => (window.location.href = "/admin/dashboard")}>
                  Overview
                </MenubarItem>
                <MenubarItem onClick={loadData}>
                  Reload Stats <MenubarShortcut>⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => (window.location.href = "/admin/settings")}>
                  Cluster Configuration
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Virtual Machines</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => (window.location.href = "/admin/vm-create")}>
                  Deploy New VM <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => (window.location.href = "/admin/vms")}>
                  View All Instances
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Tools</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => (window.location.href = "/admin/templates")}>
                  OS Template Manager
                </MenubarItem>
                <MenubarItem onClick={() => (window.location.href = "/admin/users")}>
                  User Accounts
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Help</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => window.open("https://github.com/xAyan55/KineticMesh", "_blank")}>
                  KineticMesh Docs
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => (window.location.href = "/admin/vm-create")}
              className="gap-1.5 h-8 text-xs"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Deploy Instance</span>
            </Button>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[11px] font-medium">
                  Total Instances
                </CardDescription>
                <Server className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold font-mono">
                {loading ? <Skeleton className="h-7 w-12" /> : vms.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0 text-[10px] text-muted-foreground">
              {runningVMs} active, {stoppedVMs} stopped
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[11px] font-medium">
                  Active Hypervisors
                </CardDescription>
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold font-mono text-emerald-400">
                {loading ? <Skeleton className="h-7 w-12" /> : "1 Host"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0 text-[10px] text-muted-foreground">
              Local Node KVM / QEMU
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[11px] font-medium">
                  Bound Cores
                </CardDescription>
                <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold font-mono">
                {loading ? <Skeleton className="h-7 w-12" /> : totalCores}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0 text-[10px] text-muted-foreground">
              vCPUs provisioned
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3.5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[11px] font-medium">
                  Provisioned Memory
                </CardDescription>
                <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold font-mono">
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  `${(totalMemoryMB / 1024).toFixed(1)} GB`
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0 text-[10px] text-muted-foreground">
              Total assigned RAM
            </CardContent>
          </Card>
        </div>

        {/* Host Telemetry Chart */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold">Node Capacity Throughput</CardTitle>
            <CardDescription className="text-[11px]">
              Aggregate compute and memory consumption across the local hypervisor node
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer
              config={{
                cpu: { label: "Host CPU Load (%)", color: "hsl(var(--primary))" },
                memory: { label: "Host Memory (%)", color: "hsl(var(--muted-foreground))" },
              }}
              className="h-[200px] w-full"
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
                  strokeWidth={2}
                  fill="hsl(var(--primary)/0.12)"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  fill="hsl(var(--muted-foreground)/0.08)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
