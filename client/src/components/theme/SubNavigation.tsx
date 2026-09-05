import React from "react";
import { CopyOnClick } from "./elements/CopyOnClick";
import { PowerButtons } from "./server/PowerButtons";
import { GlobeIcon, ChipIcon, TerminalIcon, ServerIcon, AdjustmentsIcon, FolderIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { LuMemoryStick, LuSave } from "react-icons/lu";

interface SubNavigationProps {
  vm: {
    id: string | number;
    name: string;
    status: string;
    ip?: string;
    cpu?: number;
    cpu_limit?: number;
    ram?: number;
    ram_limit?: number;
    disk?: number;
    disk_limit?: number;
  };
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onRefresh?: () => void;
}

export const SubNavigation: React.FC<SubNavigationProps> = ({
  vm,
  activeTab = "overview",
  onSelectTab,
  onRefresh,
}) => {
  const isRunning = vm.status === "running";
  const isStopped = vm.status === "stopped" || vm.status === "offline";

  const statusStyle = isRunning
    ? "text-success-50 bg-[color-mix(in_srgb,var(--successBackground)_40%,transparent)]"
    : isStopped
    ? "text-danger-50 bg-[color-mix(in_srgb,var(--dangerBackground)_40%,transparent)]"
    : "text-yellow-50 bg-yellow-500/40";

  const tabs = [
    { id: "overview", label: "Overview", icon: ServerIcon },
    { id: "console", label: "Serial Console", icon: TerminalIcon },
    { id: "ssh", label: "Web SSH", icon: TerminalIcon },
    { id: "hardware", label: "Hardware Specs", icon: AdjustmentsIcon },
    { id: "storage", label: "ISO & Storage", icon: FolderIcon },
    { id: "logs", label: "Audit Logs", icon: DocumentTextIcon },
  ];

  return (
    <div className="relative px-4 z-10 pt-2 mb-6">
      <div className="mx-auto w-full md:flex items-center justify-between max-w-[1240px] bg-gray-700 backdrop px-6 py-5 rounded-box shadow-lg">
        {/* Left: VM Identity & Specs */}
        <div>
          <div className="flex items-center gap-x-3">
            <h1 className="text-xl font-semibold text-gray-50 font-header">{vm.name}</h1>
            <span className={`py-1 px-2.5 rounded text-xs font-semibold uppercase tracking-wider ${statusStyle}`}>
              {vm.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-gray-300">
            {vm.ip && (
              <CopyOnClick text={vm.ip}>
                <div className="flex items-center gap-x-1.5 py-0.5 hover:text-gray-100">
                  <GlobeIcon className="w-4 h-4 text-gray-400" />
                  <span>{vm.ip}</span>
                </div>
              </CopyOnClick>
            )}

            <div className="flex items-center gap-x-1.5 py-0.5">
              <ChipIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-100 font-medium">{vm.cpu || 0}%</span>
              <span className="text-gray-400">/ {vm.cpu_limit ? `${vm.cpu_limit}%` : "100%"}</span>
            </div>

            <div className="flex items-center gap-x-1.5 py-0.5">
              <LuMemoryStick className="w-4 h-4 text-gray-400" />
              <span className="text-gray-100 font-medium">{vm.ram || 512} MB</span>
              <span className="text-gray-400">/ {vm.ram_limit ? `${vm.ram_limit} MB` : "Allocated"}</span>
            </div>

            <div className="flex items-center gap-x-1.5 py-0.5">
              <LuSave className="w-4 h-4 text-gray-400" />
              <span className="text-gray-100 font-medium">{vm.disk || 10} GB</span>
              <span className="text-gray-400">/ {vm.disk_limit ? `${vm.disk_limit} GB` : "Allocated"}</span>
            </div>
          </div>
        </div>

        {/* Right: Power Buttons */}
        <div className="mt-4 md:mt-0">
          <PowerButtons vmId={vm.id} status={vm.status} onActionComplete={onRefresh} />
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="mx-auto w-full flex items-center gap-x-4 max-w-[1240px] mt-4 border-b border-gray-700/80 overflow-x-auto pb-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              className={`flex items-center gap-x-2 py-2.5 px-3 border-b-2 text-sm font-medium transition duration-150 whitespace-nowrap ${
                active
                  ? "border-arix text-gray-100"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-arix" : "text-gray-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubNavigation;
