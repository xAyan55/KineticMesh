import React from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { ChipIcon } from "@heroicons/react/outline";
import { LuMemoryStick, LuActivity } from "react-icons/lu";

interface StatGraphsProps {
  cpuUsage?: number;
  memoryUsage?: number;
  memoryLimit?: number;
  history?: Array<{ time: string; cpu: number; memory: number }>;
}

export const StatGraphs: React.FC<StatGraphsProps> = ({
  cpuUsage = 0,
  memoryUsage = 0,
  memoryLimit = 1024,
  history = [],
}) => {
  const chartData = history.length > 0 ? history : [
    { time: "0", cpu: 5, memory: 256 },
    { time: "1", cpu: 12, memory: 310 },
    { time: "2", cpu: 18, memory: 340 },
    { time: "3", cpu: cpuUsage, memory: memoryUsage || 400 },
  ];

  return (
    <>
      {/* CPU Block */}
      <div className="bg-gray-700 backdrop p-5 rounded-box border border-gray-600/70 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ChipIcon className="w-5 h-5 text-arix" />
            <span className="text-xs font-semibold uppercase text-gray-300 tracking-wider">CPU Usage</span>
          </div>
          <span className="text-base font-bold text-gray-100">{cpuUsage}%</span>
        </div>
        <div className="h-28 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e5e5e6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e5e5e6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={[0, 100]} />
              <Area type="monotone" dataKey="cpu" stroke="#e5e5e6" strokeWidth={2} fillOpacity={1} fill="url(#cpuGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Block */}
      <div className="bg-gray-700 backdrop p-5 rounded-box border border-gray-600/70 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <LuMemoryStick className="w-5 h-5 text-arix" />
            <span className="text-xs font-semibold uppercase text-gray-300 tracking-wider">Memory Usage</span>
          </div>
          <span className="text-base font-bold text-gray-100">
            {memoryUsage} MB <span className="text-xs font-normal text-gray-400">/ {memoryLimit} MB</span>
          </span>
        </div>
        <div className="h-28 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3d8f1f" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3d8f1f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={[0, memoryLimit || 2048]} />
              <Area type="monotone" dataKey="memory" stroke="#56aa2b" strokeWidth={2} fillOpacity={1} fill="url(#memGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real-time Load Block */}
      <div className="bg-gray-700 backdrop p-5 rounded-box border border-gray-600/70 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <LuActivity className="w-5 h-5 text-arix" />
            <span className="text-xs font-semibold uppercase text-gray-300 tracking-wider">Telemetry Stream</span>
          </div>
          <span className="text-xs font-semibold text-success-50 kx-live">Active</span>
        </div>
        <div className="flex flex-col justify-center h-28 gap-2 text-xs text-gray-300">
          <div className="flex justify-between border-b border-gray-600/40 pb-1.5">
            <span className="text-gray-400">QEMU Driver:</span>
            <span className="font-mono text-gray-200">virtio-net-pci</span>
          </div>
          <div className="flex justify-between border-b border-gray-600/40 pb-1.5">
            <span className="text-gray-400">Hypervisor Engine:</span>
            <span className="font-mono text-gray-200">KVM / QEMU TCG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Socket Stream:</span>
            <span className="font-mono text-success-50">Connected</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatGraphs;
