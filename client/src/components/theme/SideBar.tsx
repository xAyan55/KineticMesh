import React, { useState, useRef, useEffect } from "react";
import {
  ServerIcon,
  UserCircleIcon,
  DotsVerticalIcon,
  CogIcon,
  LogoutIcon,
  TerminalIcon,
  GlobeIcon,
  ViewGridIcon,
  TemplateIcon,
  UsersIcon,
  AdjustmentsIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { CopyOnClick } from "./elements/CopyOnClick";
import { PowerButtons } from "./server/PowerButtons";

interface SideBarProps {
  currentVm?: {
    id: string | number;
    name: string;
    status: string;
    ip?: string;
  };
  children?: React.ReactNode;
}

export const SideBar: React.FC<SideBarProps> = ({ currentVm, children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = window.location.pathname;

  const initialData = (window as any).__INITIAL_DATA__ || {};
  const user = initialData.user || { username: "Administrator", role: "admin" };
  const isAdmin = user.role === "admin";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = (url: string) => {
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" && (pathname === "/dashboard" || pathname === "/")) return true;
    return pathname === path;
  };

  return (
    <aside className="w-[264px] flex-shrink-0 h-screen lg:flex hidden flex-col sticky top-0 p-3 z-30">
      <div className="flex flex-col h-full rounded-2xl border border-[color-mix(in_srgb,var(--gray500)_60%,transparent)] bg-gray-700 backdrop overflow-hidden shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)]">
        {/* Brand Top */}
        <div className="pt-5 px-3">
          <a
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
            className="flex gap-x-2.5 items-center font-semibold text-lg text-gray-50 px-3 pb-5"
          >
            <span className="flex items-center justify-center rounded-xl p-1 bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]">
              <img src="/arix/logo.png" alt="KineticMesh" className="h-8 w-8 object-contain rounded-md" />
            </span>
            <span className="font-header tracking-tight">KineticMesh</span>
          </a>

          {/* Primary Nav Links */}
          <div className="flex flex-col gap-1 mb-3">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center px-3 py-2.5 gap-x-3 duration-200 rounded-xl mx-1 text-sm font-medium ${
                isActive("/dashboard")
                  ? "bg-arix text-gray-900 font-semibold"
                  : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
              }`}
            >
              <ServerIcon className={`w-5 h-5 flex-shrink-0 ${isActive("/dashboard") ? "text-gray-900" : "text-gray-400"}`} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/vms")}
              className={`flex items-center px-3 py-2.5 gap-x-3 duration-200 rounded-xl mx-1 text-sm font-medium ${
                isActive("/vms")
                  ? "bg-arix text-gray-900 font-semibold"
                  : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
              }`}
            >
              <ViewGridIcon className={`w-5 h-5 flex-shrink-0 ${isActive("/vms") ? "text-gray-900" : "text-gray-400"}`} />
              <span>Virtual Machines</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center px-3 py-2.5 gap-x-3 duration-200 rounded-xl mx-1 text-sm font-medium ${
                isActive("/profile")
                  ? "bg-arix text-gray-900 font-semibold"
                  : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
              }`}
            >
              <UserCircleIcon className={`w-5 h-5 flex-shrink-0 ${isActive("/profile") ? "text-gray-900" : "text-gray-400"}`} />
              <span>Account</span>
            </button>

            {isAdmin && (
              <div className="mt-3 pt-3 border-t border-[color-mix(in_srgb,var(--gray500)_40%,transparent)]">
                <span className="px-3 text-xs text-gray-400 font-semibold uppercase tracking-widest block mb-2">
                  Administration
                </span>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className={`w-full flex items-center px-3 py-2 gap-x-3 duration-200 rounded-xl mx-1 text-xs font-medium ${
                    isActive("/admin/dashboard")
                      ? "bg-arix text-gray-900 font-semibold"
                      : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
                  }`}
                >
                  <CogIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Admin Overview</span>
                </button>
                <button
                  onClick={() => navigate("/admin/users")}
                  className={`w-full flex items-center px-3 py-2 gap-x-3 duration-200 rounded-xl mx-1 text-xs font-medium ${
                    isActive("/admin/users")
                      ? "bg-arix text-gray-900 font-semibold"
                      : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
                  }`}
                >
                  <UsersIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Users Directory</span>
                </button>
                <button
                  onClick={() => navigate("/admin/templates")}
                  className={`w-full flex items-center px-3 py-2 gap-x-3 duration-200 rounded-xl mx-1 text-xs font-medium ${
                    isActive("/admin/templates")
                      ? "bg-arix text-gray-900 font-semibold"
                      : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
                  }`}
                >
                  <TemplateIcon className="w-4 h-4 flex-shrink-0" />
                  <span>OS Templates</span>
                </button>
                <button
                  onClick={() => navigate("/admin/settings")}
                  className={`w-full flex items-center px-3 py-2 gap-x-3 duration-200 rounded-xl mx-1 text-xs font-medium ${
                    isActive("/admin/settings")
                      ? "bg-arix text-gray-900 font-semibold"
                      : "text-gray-300 hover:bg-gray-600 hover:text-gray-100"
                  }`}
                >
                  <AdjustmentsIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Panel Settings</span>
                </button>
              </div>
            )}
          </div>
          <hr className="border-b border-[color-mix(in_srgb,var(--gray500)_60%,transparent)] mx-2 my-2" />
        </div>

        {/* Dynamic Context (VM Specific Details if active) */}
        <div className="flex-1 overflow-y-auto px-2">
          {currentVm && (
            <div className="px-2 pt-1 pb-3">
              <div className="flex items-center gap-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentVm.status === "running"
                      ? "bg-success-100 shadow-[0_0_8px_rgba(86,170,43,0.8)]"
                      : "bg-danger-100"
                  }`}
                />
                <span className="font-semibold text-sm text-gray-100 truncate">{currentVm.name}</span>
              </div>
              {currentVm.ip && (
                <CopyOnClick text={currentVm.ip} className="mt-1">
                  <p className="text-xs flex items-center gap-x-1 text-gray-400 hover:text-gray-200">
                    <GlobeIcon className="w-3.5 h-3.5" />
                    <span>{currentVm.ip}</span>
                  </p>
                </CopyOnClick>
              )}
              <div className="mt-2">
                <PowerButtons vmId={currentVm.id} status={currentVm.status} icons />
              </div>
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-600/60">
                <button
                  onClick={() => navigate(`/vm/${currentVm.id}`)}
                  className={`flex items-center px-3 py-2 gap-x-2.5 rounded-lg text-xs font-medium ${
                    pathname === `/vm/${currentVm.id}` ? "bg-gray-600 text-gray-50" : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <ServerIcon className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => navigate(`/vm/${currentVm.id}/console`)}
                  className={`flex items-center px-3 py-2 gap-x-2.5 rounded-lg text-xs font-medium ${
                    pathname === `/vm/${currentVm.id}/console` ? "bg-gray-600 text-gray-50" : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <TerminalIcon className="w-4 h-4" />
                  <span>Serial Console</span>
                </button>
                <button
                  onClick={() => navigate(`/vm/${currentVm.id}/ssh`)}
                  className={`flex items-center px-3 py-2 gap-x-2.5 rounded-lg text-xs font-medium ${
                    pathname === `/vm/${currentVm.id}/ssh` ? "bg-gray-600 text-gray-50" : "text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <TerminalIcon className="w-4 h-4" />
                  <span>Web SSH</span>
                </button>
              </div>
            </div>
          )}
          {children}
        </div>

        {/* User Account Bottom Pill */}
        <div className="sticky bottom-0 p-2 pt-0" ref={dropdownRef}>
          <div className="flex w-full justify-between items-center rounded-xl border border-[color-mix(in_srgb,var(--gray500)_60%,transparent)] bg-[color-mix(in_srgb,var(--gray800)_60%,transparent)] px-3 py-2.5 relative">
            <a
              href="/profile"
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile");
              }}
              className="flex items-center gap-x-2.5 min-w-0"
            >
              <div className="w-8 h-8 rounded-full bg-arix/20 border border-arix/40 flex items-center justify-center text-arix font-semibold text-xs flex-shrink-0">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <p className="truncate text-sm font-medium text-gray-200">{user.username || "Account"}</p>
            </a>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-400 hover:text-gray-100 p-1.5 rounded-lg hover:bg-gray-600 duration-150 flex-shrink-0"
            >
              <DotsVerticalIcon className="w-5 h-5" />
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-full mb-2 right-0 w-48 bg-gray-800 border border-gray-600 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin/dashboard");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-gray-700 rounded-lg"
                  >
                    <CogIcon className="w-4 h-4" />
                    <span>Admin View</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-200 hover:bg-gray-700 rounded-lg"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>
                <div className="border-t border-gray-700 my-1" />
                <a
                  href="/logout"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-danger-50 hover:bg-danger-200/30 rounded-lg"
                >
                  <LogoutIcon className="w-4 h-4 text-danger-50" />
                  <span>Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
