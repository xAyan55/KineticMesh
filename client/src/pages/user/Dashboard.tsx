import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/theme/SideBar";
import { NavigationBar } from "@/components/theme/NavigationBar";
import { PageContentBlock } from "@/components/theme/elements/PageContentBlock";
import { VMCard } from "@/components/theme/dashboard/VMCard";
import { ServerIcon, SearchIcon, PlusIcon } from "@heroicons/react/outline";
import { FaDiscord } from "react-icons/fa";
import { LuLifeBuoy, LuChevronRight, LuCpu, LuLayers } from "react-icons/lu";

export const Dashboard: React.FC = () => {
  const [vms, setVms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/vms")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVms(data);
        else if (data && Array.isArray(data.vms)) setVms(data.vms);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching VMs:", err);
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
    <div className="min-h-screen flex h-full bg-gray-800" style={{ backgroundImage: "var(--image)" }}>
      <SideBar />
      <div className="w-full flex-1 flex flex-col min-w-0">
        <NavigationBar vms={vms} />

        <PageContentBlock title="Dashboard">
          {/* Social / Support Cards Banner */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <a
              href="https://discord.gg/invite"
              target="_blank"
              rel="noreferrer"
              className="group bg-gray-700 backdrop rounded-box border border-gray-600/70 flex items-center justify-between px-6 py-5 hover:border-gray-500 transition shadow-lg"
            >
              <div>
                <p className="font-semibold text-gray-100 flex items-center text-base">
                  Discord Community
                  <LuChevronRight className="opacity-0 ml-0 group-hover:opacity-100 group-hover:ml-1.5 duration-200" />
                </p>
                <span className="font-light text-xs text-gray-300">Join our official server for updates & assistance</span>
              </div>
              <div className="w-12 h-12 rounded-component bg-arix/20 text-arix flex items-center justify-center flex-shrink-0">
                <FaDiscord className="text-2xl" />
              </div>
            </a>

            <div
              onClick={() => alert("Contact support via our Discord server or administrator ticket.")}
              className="group bg-gray-700 backdrop rounded-box border border-gray-600/70 flex items-center justify-between px-6 py-5 hover:border-gray-500 transition cursor-pointer shadow-lg"
            >
              <div>
                <p className="font-semibold text-gray-100 flex items-center text-base">
                  Support Center
                  <LuChevronRight className="opacity-0 ml-0 group-hover:opacity-100 group-hover:ml-1.5 duration-200" />
                </p>
                <span className="font-light text-xs text-gray-300">Browse documentation and reach hypervisor engineers</span>
              </div>
              <div className="w-12 h-12 rounded-component bg-secondary-200 text-secondary-50 flex items-center justify-center flex-shrink-0">
                <LuLifeBuoy className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700/80 backdrop rounded-box p-4 border border-gray-600/60 shadow">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Total VMs</span>
              <p className="text-2xl font-bold text-gray-50 mt-1 font-header">{vms.length}</p>
            </div>
            <div className="bg-gray-700/80 backdrop rounded-box p-4 border border-gray-600/60 shadow">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Active (Running)</span>
              <p className="text-2xl font-bold text-success-50 mt-1 font-header">{totalRunning}</p>
            </div>
            <div className="bg-gray-700/80 backdrop rounded-box p-4 border border-gray-600/60 shadow">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Stopped / Inactive</span>
              <p className="text-2xl font-bold text-danger-50 mt-1 font-header">{totalStopped}</p>
            </div>
            <div className="bg-gray-700/80 backdrop rounded-box p-4 border border-gray-600/60 shadow">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Hypervisor</span>
              <p className="text-2xl font-bold text-gray-50 mt-1 font-header">QEMU/KVM</p>
            </div>
          </div>

          {/* Controls Bar: Search & Status Filters */}
          <div className="bg-gray-700 backdrop rounded-box p-4 border border-gray-600/70 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow">
            <div className="relative w-full sm:w-80">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute top-3.5 left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search virtual machines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-600 rounded-component pl-9 pr-3 py-2 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-component text-xs font-medium transition ${
                  filter === "all" ? "bg-arix text-gray-900 font-semibold" : "bg-gray-600 text-gray-300 hover:text-gray-100"
                }`}
              >
                All ({vms.length})
              </button>
              <button
                onClick={() => setFilter("running")}
                className={`px-3 py-1.5 rounded-component text-xs font-medium transition ${
                  filter === "running" ? "bg-success-200 text-success-50 font-semibold" : "bg-gray-600 text-gray-300 hover:text-gray-100"
                }`}
              >
                Online ({totalRunning})
              </button>
              <button
                onClick={() => setFilter("stopped")}
                className={`px-3 py-1.5 rounded-component text-xs font-medium transition ${
                  filter === "stopped" ? "bg-danger-200 text-danger-50 font-semibold" : "bg-gray-600 text-gray-300 hover:text-gray-100"
                }`}
              >
                Offline ({totalStopped})
              </button>
            </div>
          </div>

          {/* VM Cards Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-8 h-8 rounded-full border-2 border-arix border-t-transparent animate-spin" />
            </div>
          ) : filteredVms.length === 0 ? (
            <div className="bg-gray-700/60 backdrop rounded-box border border-gray-600/60 p-12 text-center shadow">
              <ServerIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-200 font-header">No virtual machines found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                {search ? "No VMs match your search criteria." : "There are currently no virtual machines assigned to your account."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVms.map((vm) => (
                <VMCard key={vm.id} vm={vm} />
              ))}
            </div>
          )}
        </PageContentBlock>
      </div>
    </div>
  );
};

export default Dashboard;
