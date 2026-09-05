import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { VMCard } from "@/components/theme/dashboard/VMCard";
import {
  Server,
  Search,
  LayoutGrid,
  List,
  PlusCircle,
  Copy,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface VMListProps {
  isAdmin?: boolean;
}

export const VMList: React.FC<VMListProps> = ({ isAdmin = false }) => {
  const [vms, setVms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

  const endpoint = isAdmin ? "/api/admin/vms" : "/api/vms";

  useEffect(() => {
    Promise.all([
      api.checkAuth().catch(() => ({ authenticated: false })),
      fetch(endpoint).then((res) => res.json()).catch(() => []),
    ]).then(([authData, data]) => {
      const authUser = (authData as any)?.user;
      if (authUser) {
        setUser(authUser);
      }
      if (Array.isArray(data)) setVms(data);
      else if (data && Array.isArray(data.vms)) setVms(data.vms);
      setLoading(false);
    });
  }, [endpoint]);

  const navigate = (url: string) => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const filteredVms = vms.filter((vm) =>
    vm.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell
      breadcrumbs={[{ label: isAdmin ? "Cluster Fleet" : "My Virtual Machines" }]}
      user={user}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-header text-foreground">
              {isAdmin ? "Cluster Virtual Machine Fleet" : "Your Virtual Machines"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              High performance QEMU/KVM hypervisor instances with dedicated hardware mapping
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute top-2.5 left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter instances..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background/60 border border-border/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60"
              />
            </div>

            {/* Grid / Table View Switcher */}
            <div className="flex items-center bg-card/60 border border-border/60 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {isAdmin && (
              <Button
                size="sm"
                onClick={() => navigate("/admin/vm-create")}
                className="gap-1.5 text-xs h-8 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Deploy VM</span>
              </Button>
            )}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filteredVms.length === 0 ? (
          <div className="bg-card/40 backdrop rounded-xl border border-border/40 p-12 text-center shadow-xs">
            <Server className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground font-header">No virtual machines found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search ? "No virtual machines match your filter query." : "No virtual machines currently exist."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVms.map((vm) => (
              <VMCard key={vm.id} vm={vm} />
            ))}
          </div>
        ) : (
          /* High Density Table View */
          <div className="bg-card/50 backdrop rounded-xl border border-border/50 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-foreground border-collapse">
              <thead className="bg-muted/40 border-b border-border/50 text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Instance Name</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Address</th>
                  <th className="py-3 px-4 font-semibold">vCPU</th>
                  <th className="py-3 px-4 font-semibold">Memory</th>
                  <th className="py-3 px-4 font-semibold">Disk</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredVms.map((vm) => (
                  <tr key={vm.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground font-header">{vm.name}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                          vm.status === "running"
                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                            : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                        }`}
                      >
                        {vm.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        onClick={() => navigator.clipboard.writeText(vm.ip || "127.0.0.1:22")}
                        className="text-muted-foreground font-mono hover:text-foreground cursor-pointer flex items-center gap-1"
                        title="Click to copy"
                      >
                        {vm.ip || "127.0.0.1:22"}
                        <Copy className="w-3 h-3 opacity-50" />
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{vm.cpu || 1} core</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{vm.ram || 512} MB</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{vm.disk || 10} GB</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/vm/${vm.id}`)}
                        className="text-primary hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        Manage <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default VMList;
