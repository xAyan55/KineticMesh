import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/theme/SideBar";
import { NavigationBar } from "@/components/theme/NavigationBar";
import { SubNavigation } from "@/components/theme/SubNavigation";
import { ServerDetailsBlock } from "@/components/theme/server/ServerDetailsBlock";
import { StatGraphs } from "@/components/theme/server/StatGraphs";
import { Console } from "@/components/theme/server/Console";
import { Button } from "@/components/theme/elements/Button";
import { Dialog } from "@/components/theme/elements/Dialog";
import { Alert } from "@/components/theme/elements/Alert";
import { TerminalIcon, AdjustmentsIcon, FolderIcon, TrashIcon, DocumentTextIcon, GlobeIcon } from "@heroicons/react/outline";

interface VMDetailProps {
  vmId: string | number;
}

export const VMDetail: React.FC<VMDetailProps> = ({ vmId }) => {
  const [vm, setVm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isoList, setIsoList] = useState<string[]>([]);
  const [selectedIso, setSelectedIso] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchVm = () => {
    fetch(`/api/vms/${vmId}`)
      .then((res) => res.json())
      .then((data) => {
        setVm(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading VM:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVm();
    fetch("/api/iso-list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setIsoList(data);
        else if (data && Array.isArray(data.isos)) setIsoList(data.isos);
      })
      .catch(() => {});

    fetch(`/api/vms/${vmId}/logs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
        else if (data && Array.isArray(data.logs)) setLogs(data.logs);
      })
      .catch(() => {});
  }, [vmId]);

  const handleAttachIso = async () => {
    if (!selectedIso) return;
    try {
      await fetch(`/api/vms/${vmId}/iso/attach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iso: selectedIso }),
      });
      fetchVm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDetachIso = async () => {
    try {
      await fetch(`/api/vms/${vmId}/iso/detach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      fetchVm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/vms/${vmId}`, { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/vms";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="w-8 h-8 rounded-full border-2 border-arix border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!vm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-gray-300">
        <p>Virtual machine #{vmId} not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex h-full bg-gray-800" style={{ backgroundImage: "var(--image)" }}>
      <SideBar currentVm={vm} />
      <div className="w-full flex-1 flex flex-col min-w-0">
        <NavigationBar />

        <SubNavigation
          vm={vm}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onRefresh={fetchVm}
        />

        <main className="w-full px-4 pb-12 mx-auto max-w-[1240px]">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              <ServerDetailsBlock
                cpu={vm.cpu_usage || 0}
                cpuLimit={vm.cpu_limit || 100}
                memory={vm.ram || 512}
                memoryLimit={vm.ram_limit || 1024}
                disk={vm.disk || 10}
                diskLimit={vm.disk_limit || 20}
                status={vm.status}
              />

              <div className="grid lg:grid-cols-3 gap-4">
                <StatGraphs
                  cpuUsage={vm.cpu_usage || 0}
                  memoryUsage={vm.ram || 512}
                  memoryLimit={vm.ram_limit || 1024}
                />
              </div>

              {/* Hardware Quick Summary Card */}
              <div className="bg-gray-700 backdrop rounded-box p-6 border border-gray-600/70 shadow-lg">
                <h3 className="text-base font-header font-semibold text-gray-100 mb-4 pb-2 border-b border-gray-600/50">
                  Guest Configuration Details
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Operating System</span>
                    <span className="text-gray-200 font-medium">{vm.template || "Standard Image"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">CPU Model</span>
                    <span className="text-gray-200 font-medium">{vm.cpu_model || "host-passthrough"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Network Mode</span>
                    <span className="text-gray-200 font-medium">{vm.network_type || "User NAT / Port Forwarding"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">MAC Address</span>
                    <span className="font-mono text-gray-200">{vm.mac_address || "52:54:00:12:34:56"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">ACPI Support</span>
                    <span className="text-gray-200 font-medium">{vm.enable_acpi !== false ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">SMBIOS Manufacturer</span>
                    <span className="text-gray-200 font-medium">{vm.smbios_manufacturer || "KineticMesh QEMU"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Console Tab */}
          {activeTab === "console" && (
            <div className="flex flex-col gap-6">
              <Console vmId={vmId} />
              <div className="grid lg:grid-cols-3 gap-4">
                <StatGraphs cpuUsage={vm.cpu_usage || 0} memoryUsage={vm.ram || 512} />
              </div>
            </div>
          )}

          {/* SSH Tab */}
          {activeTab === "ssh" && (
            <div className="bg-gray-700 backdrop rounded-box p-6 border border-gray-600/70 shadow-lg">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-600/50">
                <TerminalIcon className="w-5 h-5 text-arix" />
                <h3 className="text-base font-header font-semibold text-gray-100">Web SSH Session</h3>
              </div>
              <p className="text-xs text-gray-300 mb-4">
                Direct SSH connection to guest port {vm.ssh_port || 22}. Host address: {vm.ip || "127.0.0.1"}
              </p>
              <div className="h-[480px] bg-gray-900 border border-gray-700 rounded-box flex items-center justify-center">
                <Console vmId={vmId} />
              </div>
            </div>
          )}

          {/* Hardware Specs Tab */}
          {activeTab === "hardware" && (
            <div className="bg-gray-700 backdrop rounded-box p-6 border border-gray-600/70 shadow-lg">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-600/50">
                <AdjustmentsIcon className="w-5 h-5 text-arix" />
                <h3 className="text-base font-header font-semibold text-gray-100">Virtual Machine Hardware</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-medium">Allocated vCPU Cores</label>
                  <p className="bg-gray-800 p-3 rounded-component text-gray-100 font-mono">{vm.cpu || 1} vCPU</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-medium">Assigned RAM Memory</label>
                  <p className="bg-gray-800 p-3 rounded-component text-gray-100 font-mono">{vm.ram || 512} MB</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-medium">Root Disk Capacity</label>
                  <p className="bg-gray-800 p-3 rounded-component text-gray-100 font-mono">{vm.disk || 10} GB</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-medium">Emulated CPU Architecture</label>
                  <p className="bg-gray-800 p-3 rounded-component text-gray-100 font-mono">{vm.cpu_model || "qemu64"}</p>
                </div>
              </div>
            </div>
          )}

          {/* ISO Storage Tab */}
          {activeTab === "storage" && (
            <div className="bg-gray-700 backdrop rounded-box p-6 border border-gray-600/70 shadow-lg">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-600/50">
                <FolderIcon className="w-5 h-5 text-arix" />
                <h3 className="text-base font-header font-semibold text-gray-100">CD-ROM / Optical Media</h3>
              </div>
              <p className="text-xs text-gray-300 mb-4">
                Attach an operating system installation ISO or live recovery media to the virtual optical drive.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                <select
                  value={selectedIso}
                  onChange={(e) => setSelectedIso(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-component p-2.5 text-xs text-gray-200 flex-1 w-full"
                >
                  <option value="">Select available ISO image...</option>
                  {isoList.map((iso) => (
                    <option key={iso} value={iso}>
                      {iso}
                    </option>
                  ))}
                </select>
                <Button onClick={handleAttachIso} disabled={!selectedIso} size="small">
                  Mount ISO
                </Button>
                {vm.mounted_iso && (
                  <Button.Danger onClick={handleDetachIso} size="small">
                    Eject Media
                  </Button.Danger>
                )}
              </div>

              {vm.mounted_iso && (
                <div className="p-4 bg-gray-800/80 rounded-component border border-gray-600 text-xs text-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 block">Currently Mounted ISO:</span>
                    <span className="font-mono text-arix">{vm.mounted_iso}</span>
                  </div>
                  <span className="text-success-50 font-semibold uppercase text-[10px] bg-success-200/30 px-2 py-1 rounded">
                    Mounted
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="bg-gray-700 backdrop rounded-box p-6 border border-gray-600/70 shadow-lg">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-600/50">
                <DocumentTextIcon className="w-5 h-5 text-arix" />
                <h3 className="text-base font-header font-semibold text-gray-100">Execution Audit Logs</h3>
              </div>
              <div className="bg-gray-900 p-4 rounded-box font-mono text-xs text-gray-300 h-80 overflow-y-auto space-y-2">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">No audit records found for VM #{vmId}.</p>
                ) : (
                  logs.map((log: any, i) => (
                    <div key={i} className="border-b border-gray-800 pb-1">
                      <span className="text-gray-500">[{typeof log === "string" ? "LOG" : log.timestamp || "INFO"}]</span>{" "}
                      <span>{typeof log === "string" ? log : log.message || JSON.stringify(log)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="mt-8 bg-danger-200/20 border border-danger-100/50 rounded-box p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-danger-50 font-header">Terminate Virtual Machine</h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Irreversibly delete this virtual machine, its storage disk image, and released port mappings.
                </p>
              </div>
              <Button.Danger onClick={() => setDeleteModalOpen(true)}>
                <TrashIcon className="w-4 h-4 mr-1.5" />
                <span>Delete VM</span>
              </Button.Danger>
            </div>
          </div>
        </main>
      </div>

      <Dialog.Confirm
        open={deleteModalOpen}
        title={`Delete Virtual Machine ${vm.name}?`}
        onClose={() => setDeleteModalOpen(false)}
        confirm="Delete Permanently"
        onConfirmed={handleDelete}
        isLoading={deleting}
      >
        Are you sure you want to delete <strong>{vm.name}</strong>? This action will permanently wipe all disk volumes and cannot be undone.
      </Dialog.Confirm>
    </div>
  );
};

export default VMDetail;
