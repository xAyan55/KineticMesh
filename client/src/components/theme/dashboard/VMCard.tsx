import React from "react";
import { GlobeIcon } from "@heroicons/react/outline";
import { CopyOnClick } from "../elements/CopyOnClick";

export interface VMCardProps {
  vm: {
    id: string | number;
    name: string;
    status: string;
    ip?: string;
    ram?: number;
    cpu?: number;
    disk?: number;
    template?: string;
  };
}

export const VMCard: React.FC<VMCardProps> = ({ vm }) => {
  const isRunning = vm.status === "running";
  const isStopped = vm.status === "stopped" || vm.status === "offline";

  const statusStyle = isRunning
    ? "text-success-50 bg-[color-mix(in_srgb,var(--successBackground)_40%,transparent)]"
    : isStopped
    ? "text-danger-50 bg-[color-mix(in_srgb,var(--dangerBackground)_40%,transparent)]"
    : "text-yellow-50 bg-yellow-500/40";

  const navigate = (url: string) => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const ipDisplay = vm.ip || "127.0.0.1:22";

  return (
    <div className="bg-gray-700 backdrop px-6 py-5 rounded-box hoverable flex flex-col justify-between border border-gray-600/70 shadow-lg">
      <div>
        {/* Card Header: Name + Status Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-600/40">
          <p className="text-base font-semibold text-gray-50 font-header truncate max-w-[200px]" title={vm.name}>
            {vm.name}
          </p>
          <span className={`py-1 px-2.5 rounded text-xs font-semibold uppercase tracking-wider ${statusStyle}`}>
            {vm.status}
          </span>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 my-4 text-xs">
          <div className="col-span-2 flex items-center gap-1.5">
            <span className="text-gray-400 font-light">IP:</span>
            <CopyOnClick text={ipDisplay}>
              <span className="text-gray-200 font-medium hover:text-gray-50 flex items-center gap-1">
                <GlobeIcon className="w-3.5 h-3.5 text-gray-400" />
                {ipDisplay}
              </span>
            </CopyOnClick>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-light uppercase">CPU:</span>
            <span className="text-gray-100 font-medium">{vm.cpu || 1} vCPU</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-light">RAM:</span>
            <span className="text-gray-100 font-medium">{vm.ram || 512} MB</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-gray-400 font-light">Disk:</span>
            <span className="text-gray-100 font-medium">{vm.disk || 10} GB</span>
          </div>

          <div className="flex items-center gap-1 truncate">
            <span className="text-gray-400 font-light">OS:</span>
            <span className="text-gray-300 truncate" title={vm.template || "Standard QEMU"}>
              {vm.template || "Standard QEMU"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate(`/vm/${vm.id}`)}
        className="text-secondary-50 bg-secondary-200 border border-secondary-100 hover:bg-secondary-100 rounded-component px-3 py-2.5 w-full block text-center duration-300 font-medium text-sm mt-2 transition"
      >
        Manage VM
      </button>
    </div>
  );
};

export default VMCard;
