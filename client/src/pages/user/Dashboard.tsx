import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { VMCard } from "@/components/theme/dashboard/VMCard";
import {
  Server,
  Search,
  PlusCircle,
  ExternalLink,
  LifeBuoy,
  ChevronRight,
  Activity,
  Cpu,
  Layers,
  Power,
  RefreshCw,
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export const Dashboard: React.FC = () => {
  const [vms, setVms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.checkAuth().catch(() => ({ authenticated: false })),
      fetch("/api/vms").then((res) => res.json()).catch(() => []),
    ]).then(([authData, data]) => {
      const authUser = (authData as any)?.user;
      if (authUser) {
        setUser(authUser);
      }
      if (Array.isArray(data)) setVms(data);
      else if (data && Array.isArray(data.vms)) setVms(data.vms);
      setLoading(false);
    });
  }, []);

  const navigate = (url: string) => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const filteredVms = vms.filter((vm) => {
    const matchesSearch = vm.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "running") return matchesSearch && vm.status === "running";
    if (filter === "stopped") return matchesSearch && (vm.status === "stopped" || vm.status === "offline");
    return matchesSearch;
  });

  const totalRunning = vms.filter((v) => v.status === "running").length;
  const totalStopped = vms.length - totalRunning;

  return (
    <AppShell
      breadcrumbs={[{ label: "Overview" }]}
      user={user}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Social / Support Cards Banner */}
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="https://discord.gg/invite"
            target="_blank"
            rel="noreferrer"
            className="group bg-card/60 backdrop rounded-xl border border-border/60 p-5 flex items-center justify-between hover:border-primary/40 transition-all shadow-sm"
          >
            <div>
              <p className="font-semibold text-foreground flex items-center text-sm">
                Discord Community
                <ChevronRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 duration-200" />
              </p>
              <span className="text-xs text-muted-foreground mt-0.5 block">
                Join our official server for real-time updates & community assistance
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#5865F2]/15 text-[#5865F2] flex items-center justify-center shrink-0">
              <FaDiscord className="text-xl" />
            </div>
          </a>

          <div
            onClick={() => alert("Reach support engineers via our official Discord community.")}
            className="group bg-card/60 backdrop rounded-xl border border-border/60 p-5 flex items-center justify-between hover:border-primary/40 transition-all cursor-pointer shadow-sm"
          >
            <div>
              <p className="font-semibold text-foreground flex items-center text-sm">
                Hypervisor Support Center
                <ChevronRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 duration-200" />
              </p>
              <span className="text-xs text-muted-foreground mt-0.5 block">
                Access technical documentation or reach hypervisor operators
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50 shadow-xs">
            <CardHeader className="p-4 pb-1">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Total Instances
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-2xl font-bold font-header text-foreground">{vms.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 shadow-xs">
            <CardHeader className="p-4 pb-1">
              <CardDescription className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                Active (Running)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-2xl font-bold font-header text-emerald-400">{totalRunning}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 shadow-xs">
            <CardHeader className="p-4 pb-1">
              <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Stopped / Inactive
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-2xl font-bold font-header text-muted-foreground">{totalStopped}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 shadow-xs">
            <CardHeader className="p-4 pb-1">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Hypervisor Platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-lg font-bold font-header text-foreground">QEMU / KVM</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Bar: Search & Status Filters */}
        <div className="bg-card/50 backdrop rounded-xl p-4 border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute top-3 left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search virtual machines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background/60 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "secondary"}
              onClick={() => setFilter("all")}
              className="text-xs h-8"
            >
              All ({vms.length})
            </Button>
            <Button
              size="sm"
              variant={filter === "running" ? "default" : "secondary"}
              onClick={() => setFilter("running")}
              className="text-xs h-8"
            >
              Online ({totalRunning})
            </Button>
            <Button
              size="sm"
              variant={filter === "stopped" ? "default" : "secondary"}
              onClick={() => setFilter("stopped")}
              className="text-xs h-8"
            >
              Offline ({totalStopped})
            </Button>
          </div>
        </div>

        {/* VM Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filteredVms.length === 0 ? (
          <div className="bg-card/40 backdrop rounded-xl border border-border/40 p-12 text-center shadow-xs">
            <Server className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground font-header">No virtual machines found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search ? "No instances match your search query." : "There are currently no virtual machines assigned to your account."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVms.map((vm) => (
              <VMCard key={vm.id} vm={vm} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Dashboard;
