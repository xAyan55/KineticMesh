import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Shield, User, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"ssh" | "api">("ssh");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.checkAuth().then((res) => {
      if (res && res.authenticated) {
        setUser(res.user);
      }
    }).catch(() => null);
  }, []);

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
    } catch {
      setStatusMsg({ type: "error", text: "A network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      breadcrumbs={[{ label: "Account Overview" }]}
      user={user}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold font-header text-foreground">Account Overview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your account credentials, security preferences, and API access
          </p>
        </div>

        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            {statusMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Account Profile Card */}
          <Card className="bg-card/50 border-border/50 shadow-xs">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-header font-bold text-xl shadow-sm">
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <CardTitle className="text-base font-header">{user?.username || "Administrator"}</CardTitle>
                  <CardDescription className="text-xs capitalize flex items-center gap-1.5 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                      {user?.role || "User"}
                    </Badge>
                    <span>Account</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Username
                </label>
                <div className="bg-background/60 p-2.5 rounded-lg border border-border/60 text-xs text-foreground font-mono">
                  {user?.username || "admin"}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <div className="bg-background/60 p-2.5 rounded-lg border border-border/60 text-xs text-foreground font-mono">
                  {user?.email || "No external email configured"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Update Card */}
          <Card className="bg-card/50 border-border/50 shadow-xs">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-header flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" /> Update Password
              </CardTitle>
              <CardDescription className="text-xs">
                Ensure your account uses a secure passkey to protect hypervisor access
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <form onSubmit={handlePasswordUpdate} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-background/60 border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-background/60 border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-background/60 border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/60"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-2 text-xs h-9 cursor-pointer">
                  {loading ? "Updating..." : "Save Password Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* SSH / API Tabbed Card */}
        <Card className="bg-card/50 border-border/50 shadow-xs">
          <CardHeader className="p-6 pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-header">
                {activeTab === "ssh" ? "Public SSH Keys" : "Account API Credentials"}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={activeTab === "ssh" ? "default" : "ghost"}
                  onClick={() => setActiveTab("ssh")}
                  className="text-xs h-7"
                >
                  SSH Keys
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "api" ? "default" : "ghost"}
                  onClick={() => setActiveTab("api")}
                  className="text-xs h-7"
                >
                  API Keys
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-xs text-muted-foreground">
            {activeTab === "ssh" ? (
              <p>
                Authorized SSH public keys are managed automatically and injected into tenant guest instances at boot time.
              </p>
            ) : (
              <p>
                Administrative API tokens can be provisioned through the Hypervisor Settings panel.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Profile;
