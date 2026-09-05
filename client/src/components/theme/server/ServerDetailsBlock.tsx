import React from "react";
import { ChipIcon } from "@heroicons/react/outline";
import { LuMemoryStick, LuSave } from "react-icons/lu";

interface ServerDetailsBlockProps {
  cpu?: number;
  cpuLimit?: number;
  memory?: number;
  memoryLimit?: number;
  disk?: number;
  diskLimit?: number;
  status?: string;
}

export const ServerDetailsBlock: React.FC<ServerDetailsBlockProps> = ({
  cpu = 0,
  cpuLimit = 100,
  memory = 512,
  memoryLimit = 1024,
  disk = 10,
  diskLimit = 20,
  status = "running",
}) => {
  const isOffline = status === "stopped" || status === "offline";

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-4">
      {/* CPU Card */}
      <div className="bg-gray-700 backdrop rounded-box px-6 py-5 flex justify-between items-center border border-gray-600/70 shadow-lg">
        <div>
          <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">CPU Usage</span>
          <div className="flex items-baseline gap-x-1.5 mt-1">
            {isOffline ? (
              <p className="text-lg font-bold text-gray-400">Offline</p>
            ) : (
              <p className="text-2xl font-bold text-gray-50 font-header">{cpu}%</p>
            )}
            <span className="text-xs text-gray-400 font-medium">/ {cpuLimit ? `${cpuLimit}%` : "100%"}</span>
          </div>
        </div>
        <div className="text-gray-900 bg-arix rounded-component w-14 h-14 flex items-center justify-center flex-shrink-0 shadow-md">
          <ChipIcon className="w-8 h-8" />
        </div>
      </div>

      {/* Memory Card */}
      <div className="bg-gray-700 backdrop rounded-box px-6 py-5 flex justify-between items-center border border-gray-600/70 shadow-lg">
        <div>
          <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Memory Allocation</span>
          <div className="flex items-baseline gap-x-1.5 mt-1">
            <p className="text-2xl font-bold text-gray-50 font-header">{memory} MB</p>
            <span className="text-xs text-gray-400 font-medium">/ {memoryLimit ? `${memoryLimit} MB` : "Allocated"}</span>
          </div>
        </div>
        <div className="text-gray-900 bg-arix rounded-component w-14 h-14 flex items-center justify-center flex-shrink-0 shadow-md">
          <LuMemoryStick className="w-8 h-8" />
        </div>
      </div>

      {/* Disk Card */}
      <div className="bg-gray-700 backdrop rounded-box px-6 py-5 flex justify-between items-center border border-gray-600/70 shadow-lg">
        <div>
          <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Storage Usage</span>
          <div className="flex items-baseline gap-x-1.5 mt-1">
            <p className="text-2xl font-bold text-gray-50 font-header">{disk} GB</p>
            <span className="text-xs text-gray-400 font-medium">/ {diskLimit ? `${diskLimit} GB` : "Allocated"}</span>
          </div>
        </div>
        <div className="text-gray-900 bg-arix rounded-component w-14 h-14 flex items-center justify-center flex-shrink-0 shadow-md">
          <LuSave className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default ServerDetailsBlock;
