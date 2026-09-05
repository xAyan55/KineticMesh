import React, { useState } from "react";
import { MenuIcon, XIcon, SupportIcon, ServerIcon, UserCircleIcon, ViewGridIcon } from "@heroicons/react/outline";
import { FaDiscord } from "react-icons/fa";

interface NavigationBarProps {
  vms?: Array<{ id: string | number; name: string; status: string }>;
  onSelectVm?: (id: string | number) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ vms = [], onSelectVm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (url: string) => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setIsOpen(false);
  };

  const filteredVms = searchQuery
    ? vms.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : vms;

  return (
    <>
      <header className="w-full px-4 relative z-20">
        <div className="mx-auto w-full flex items-center justify-between max-w-[1240px] py-3">
          {/* Left: Mobile Brand & Quick Search */}
          <div className="flex items-center gap-x-4">
            <div className="lg:hidden flex items-center gap-x-2">
              <a
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
                className="flex items-center gap-2 font-semibold text-gray-100"
              >
                <img src="/arix/logo.png" alt="logo" className="h-7 w-7 object-contain" />
                <span className="font-header">KineticMesh</span>
              </a>
            </div>

            {/* Quick VM Selector dropdown */}
            <div className="hidden sm:flex items-center relative">
              <select
                aria-label="Select Virtual Machine"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-component text-xs py-1.5 px-3 text-gray-200 focus:outline-none focus:border-gray-400 cursor-pointer shadow-sm transition-colors"
                onChange={(e) => {
                  if (e.target.value && onSelectVm) {
                    onSelectVm(e.target.value);
                  } else if (e.target.value) {
                    navigate(`/vm/${e.target.value}`);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled className="bg-gray-800 text-gray-400">
                  Select Virtual Machine...
                </option>
                {filteredVms.map((vm) => (
                  <option key={vm.id} value={vm.id} className="bg-gray-800 text-gray-200">
                    {vm.name} ({vm.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Community links & Mobile Toggle */}
          <div className="flex items-center gap-x-5">
            <div className="hidden lg:flex items-center gap-x-6 text-sm text-gray-300">
              <a
                href="https://discord.gg/invite"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-gray-100 transition duration-150"
              >
                <FaDiscord className="w-4 h-4 text-arix" />
                <span>Discord</span>
              </a>
              <a
                href="/support"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Support portal: Please contact support via Discord or administrator.");
                }}
                className="flex items-center gap-1.5 hover:text-gray-100 transition duration-150"
              >
                <SupportIcon className="w-4 h-4 text-gray-400" />
                <span>Support</span>
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-1.5 text-gray-300 hover:text-gray-100 rounded-lg hover:bg-gray-700"
            >
              {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800/95 backdrop-blur-xl p-5 flex flex-col overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <img src="/arix/logo.png" alt="logo" className="h-8 w-8" />
              <span className="font-header font-semibold text-lg text-gray-100">KineticMesh</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 p-1">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-2 py-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-gray-200 hover:bg-gray-700 font-medium"
            >
              <ServerIcon className="w-5 h-5 text-arix" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/vms")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-gray-200 hover:bg-gray-700 font-medium"
            >
              <ViewGridIcon className="w-5 h-5 text-arix" />
              <span>Virtual Machines</span>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-gray-200 hover:bg-gray-700 font-medium"
            >
              <UserCircleIcon className="w-5 h-5 text-arix" />
              <span>Account Settings</span>
            </button>
          </div>

          <div className="mt-auto border-t border-gray-700 pt-4 flex justify-between text-sm text-gray-400">
            <a href="https://discord.gg/invite" target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <FaDiscord className="w-4 h-4 text-arix" />
              <span>Discord</span>
            </a>
            <a href="/logout" className="text-danger-50 font-medium">
              Logout
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
