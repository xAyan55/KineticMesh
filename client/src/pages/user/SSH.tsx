import React, { useEffect, useState } from "react";
import { SideBar } from "@/components/theme/SideBar";
import { NavigationBar } from "@/components/theme/NavigationBar";
import { SubNavigation } from "@/components/theme/SubNavigation";
import { Console as ConsoleTerminal } from "@/components/theme/server/Console";
import { TerminalIcon } from "@heroicons/react/outline";

interface SSHPageProps {
  vmId: string | number;
}

export const SSH: React.FC<SSHPageProps> = ({ vmId }) => {
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
            activeTab="ssh"
            onSelectTab={(tab) => {
              if (tab === "overview") {
                window.history.pushState(null, "", `/vm/${vmId}`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              } else if (tab === "console") {
                window.history.pushState(null, "", `/vm/${vmId}/console`);
                window.dispatchEvent(new PopStateEvent("popstate"));
              }
            }}
            onRefresh={fetchVm}
          />
        )}

        <main className="w-full px-4 pb-12 mx-auto max-w-[1240px]">
          <div className="bg-gray-700 backdrop rounded-box p-6 border border-gray-600/70 shadow-xl mb-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-600/50">
              <TerminalIcon className="w-5 h-5 text-arix" />
              <h3 className="text-base font-header font-semibold text-gray-100">Interactive Web SSH</h3>
            </div>
            <p className="text-xs text-gray-300 mb-4">
              Direct terminal access via guest network port {vm?.ssh_port || 22}. Host address: {vm?.ip || "127.0.0.1"}
            </p>
            <ConsoleTerminal vmId={vmId} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SSH;
