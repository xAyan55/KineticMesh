import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/theme/SideBar";
import { NavigationBar } from "@/components/theme/NavigationBar";
import { PageContentBlock } from "@/components/theme/elements/PageContentBlock";
import { VMCard } from "@/components/theme/dashboard/VMCard";
import { ServerIcon, SearchIcon, ViewGridIcon, ViewListIcon, PlusIcon } from "@heroicons/react/outline";
import { CopyOnClick } from "@/components/theme/elements/CopyOnClick";

interface VMListProps {
  isAdmin?: boolean;
}

export const VMList: React.FC<VMListProps> = ({ isAdmin = false }) => {
  const [vms, setVms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");

  const endpoint = isAdmin ? "/api/admin/vms" : "/api/vms";

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVms(data);
        else if (data && Array.isArray(data.vms)) setVms(data.vms);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching VM list:", err);
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
    <div className="min-h-screen flex h-full bg-gray-800" style={{ backgroundImage: "var(--image)" }}>
      <SideBar />
      <div className="w-full flex-1 flex flex-col min-w-0">
        <NavigationBar vms={vms} />

        <PageContentBlock title={isAdmin ? "Admin Virtual Machines" : "Virtual Machines"}>
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-header font-bold text-gray-100">
                {isAdmin ? "Cluster Virtual Machines" : "Your Virtual Machines"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Active infrastructure units on QEMU/KVM hypervisor
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64 flex items-center">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter VMs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-component pl-10 pr-3.5 py-1.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-gray-700 focus:ring-1 focus:ring-gray-400/30 transition-colors"
                />
              </div>

              {/* Grid / Table View Switcher */}
              <div className="flex items-center bg-gray-700 border border-gray-600 rounded-component p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded text-xs transition ${
                    viewMode === "grid" ? "bg-arix text-gray-900" : "text-gray-400 hover:text-gray-200"
                  }`}
                  title="Grid View"
                >
                  <ViewGridIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded text-xs transition ${
                    viewMode === "table" ? "bg-arix text-gray-900" : "text-gray-400 hover:text-gray-200"
                  }`}
                  title="Table View"
                >
                  <ViewListIcon className="w-4 h-4" />
                </button>
              </div>

              {isAdmin && (
                <button
                  onClick={() => navigate("/admin/vm-create")}
                  className="bg-arix hover:opacity-95 text-gray-900 font-semibold text-xs px-3 py-2 rounded-component flex items-center gap-1.5 shadow"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Deploy VM</span>
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-8 h-8 rounded-full border-2 border-arix border-t-transparent animate-spin" />
            </div>
          ) : filteredVms.length === 0 ? (
            <div className="bg-gray-700/60 backdrop rounded-box border border-gray-600/60 p-12 text-center shadow">
              <ServerIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-200 font-header">No virtual machines found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
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
            <div className="bg-gray-700 backdrop rounded-box border border-gray-600/70 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-gray-200 border-collapse">
                <thead className="bg-gray-800/80 border-b border-gray-600/60 text-gray-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">IP & Port</th>
                    <th className="py-3 px-4">vCPU</th>
                    <th className="py-3 px-4">Memory</th>
                    <th className="py-3 px-4">Storage</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {filteredVms.map((vm) => (
                    <tr key={vm.id} className="hover:bg-gray-600/40 transition">
                      <td className="py-3.5 px-4 font-medium text-gray-100 font-header">{vm.name}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            vm.status === "running"
                              ? "text-success-50 bg-success-200/40"
                              : "text-danger-50 bg-danger-200/40"
                          }`}
                        >
                          {vm.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <CopyOnClick text={vm.ip || "127.0.0.1:22"}>
                          <span className="text-gray-300 font-mono hover:text-gray-100 cursor-pointer">
                            {vm.ip || "127.0.0.1:22"}
                          </span>
                        </CopyOnClick>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">{vm.cpu || 1} core</td>
                      <td className="py-3.5 px-4 text-gray-300">{vm.ram || 512} MB</td>
                      <td className="py-3.5 px-4 text-gray-300">{vm.disk || 10} GB</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/vm/${vm.id}`)}
                          className="text-arix hover:underline font-semibold"
                        >
                          Manage &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PageContentBlock>
      </div>
    </div>
  );
};

export default VMList;
