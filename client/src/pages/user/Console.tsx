import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/theme/SideBar";
import { NavigationBar } from "@/components/theme/NavigationBar";
import { SubNavigation } from "@/components/theme/SubNavigation";
import { Console as ConsoleTerminal } from "@/components/theme/server/Console";
import { StatGraphs } from "@/components/theme/server/StatGraphs";

interface ConsolePageProps {
  vmId: string | number;
}

export const Console: React.FC<ConsolePageProps> = ({ vmId }) => {
  const [vm, setVm] = useState<any>(null);

  const fetchVm = () => {
    fetch(`/api/vms/${vmId}`)
      .then((res) => res.json())
      .then((data) => setVm(data))
      .catch((err) => console.error("Error loading VM:", err));
  };

  useEffect(() => {
    fetchVm();
  }, [vmId]);

  return (
    <div className="min-h-screen flex h-full bg-gray-800" style={{ backgroundImage: "var(--image)" }}>
      <SideBar currentVm={vm} />
      <div className="w-full flex-1 flex flex-col min-w-0">
        <NavigationBar />
        {vm && (
          <SubNavigation
            vm={vm}
            activeTab="console"
            onSelectTab={(tab) => {
              if (tab === "overview") {
                window.history.pushState(null, "", `/vm/${vmId}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              } else if (tab === "ssh") {
                window.history.pushState(null, "", `/vm/${vmId}/ssh`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }
            }}
            onRefresh={fetchVm}
          />
        )}

        <main className="w-full px-4 pb-12 mx-auto max-w-[1240px] flex flex-col gap-6">
          <ConsoleTerminal vmId={vmId} />
          <div className="grid lg:grid-cols-3 gap-4">
            <StatGraphs
              cpuUsage={vm?.cpu_usage || 0}
              memoryUsage={vm?.ram || 512}
              memoryLimit={vm?.ram_limit || 1024}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Console;
