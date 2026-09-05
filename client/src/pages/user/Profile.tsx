import React, { useState } from "react";
import { SideBar } from "@/components/theme/SideBar";
import { NavigationBar } from "@/components/theme/NavigationBar";
import { PageContentBlock } from "@/components/theme/elements/PageContentBlock";
import { Field } from "@/components/theme/elements/Field";
import { Button } from "@/components/theme/elements/Button";
import { Alert } from "@/components/theme/elements/Alert";
import { UserCircleIcon, KeyIcon, MailIcon, KeyIcon as KeyIconSolid } from "@heroicons/react/outline";

export const Profile: React.FC = () => {
  const initialData = (window as any).__INITIAL_DATA__ || {};
  const user = initialData.user || { username: "Administrator", email: "admin@kinetichost.com", role: "admin" };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"ssh" | "api">("ssh");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setStatusMsg({ type: "success", text: "Password updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const err = await res.json().catch(() => ({}));
        setStatusMsg({ type: "error", text: err.error || "Failed to update password." });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "A network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex h-full bg-gray-800" style={{ backgroundImage: "var(--image)" }}>
      <SideBar />
      <div className="w-full flex-1 flex flex-col min-w-0">
        <NavigationBar />

        <PageContentBlock title="Account Overview">
          {statusMsg && (
            <Alert type={statusMsg.type} className="mb-4">
              {statusMsg.text}
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column: Account Details & Banner */}
            <div className="flex flex-col gap-6">
              <div className="bg-gray-700 backdrop rounded-box overflow-hidden border border-gray-600/70 shadow-xl">
                {/* Banner Area */}
                <div className="w-full relative px-6 pt-5 pb-3 z-10">
                  <div
                    className="h-3/4 w-full absolute top-0 left-0 z-[-1]"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 25%, transparent) 100%)",
                    }}
                  />
                  <div className="w-[64px] h-[64px] rounded-component border-4 border-gray-700 bg-gray-900 flex items-center justify-center text-xl font-bold text-arix shadow-md">
                    {user.username?.charAt(0).toUpperCase() || "A"}
                  </div>
                </div>

                <div className="p-6 pt-2">
                  <h3 className="text-lg font-header font-semibold text-gray-100">{user.username}</h3>
                  <p className="text-xs text-gray-400 capitalize mb-4">{user.role || "User"} Account</p>

                  <div className="flex flex-col gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block mb-1">Username</span>
                      <p className="bg-gray-800 p-2.5 rounded-component text-gray-200 font-mono border border-gray-600/70">{user.username}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Email Address</span>
                      <p className="bg-gray-800 p-2.5 rounded-component text-gray-200 font-mono border border-gray-600/70">{user.email || "No email assigned"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Password Update */}
            <div className="bg-gray-700 backdrop rounded-box p-6 border border-gray-600/70 shadow-xl">
              <h3 className="text-base font-header font-semibold text-gray-100 mb-4 pb-2 border-b border-gray-600/50">
                Update Account Password
              </h3>

              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
                <Field
                  id="curr-pass"
                  type="password"
                  label="Current Password"
                  placeholder="••••••••••••"
                  icon={KeyIcon}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Field
                  id="new-pass"
                  type="password"
                  label="New Password"
                  placeholder="••••••••••••"
                  icon={KeyIcon}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Field
                  id="confirm-pass"
                  type="password"
                  label="Confirm New Password"
                  placeholder="••••••••••••"
                  icon={KeyIcon}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" isLoading={loading} className="mt-2">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Card: SSH Keys & API Keys Tab */}
          <div className="bg-gray-700 backdrop rounded-box px-6 py-5 border border-gray-600/70 shadow-xl">
            <div className="flex items-center justify-between mb-5 border-b border-gray-600/60 pb-3">
              <p className="text-sm text-gray-200 font-medium font-header">
                {activeTab === "ssh" ? "Public SSH Keys" : "Account API Credentials"}
              </p>
              <div className="flex gap-x-4 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("ssh")}
                  className={`pb-1 border-b-2 transition ${
                    activeTab === "ssh" ? "border-arix text-gray-50" : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  SSH Keys
                </button>
                <button
                  onClick={() => setActiveTab("api")}
                  className={`pb-1 border-b-2 transition ${
                    activeTab === "api" ? "border-arix text-gray-50" : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  API Keys
                </button>
              </div>
            </div>

            {activeTab === "ssh" ? (
              <div className="text-xs text-gray-300">
                <p className="mb-4 text-gray-400">
                  Manage your SSH authorized public keys used for automated guest key injection during deployment.
                </p>
                <div className="p-4 bg-gray-800 rounded-component border border-gray-600/70 text-gray-400 italic">
                  No custom SSH keys registered yet. Keys can be injected directly into guest VM images.
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-300">
                <p className="mb-4 text-gray-400">
                  Application programmatic tokens allowing full access to your tenant virtual machines.
                </p>
                <div className="p-4 bg-gray-800 rounded-component border border-gray-600/70 text-gray-400 italic">
                  API tokens are managed via the administrative control plane.
                </div>
              </div>
            )}
          </div>
        </PageContentBlock>
      </div>
    </div>
  );
};

export default Profile;
