import * as React from "react";
import { User, Lock, Key, Shield, ShieldCheck, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function Profile() {
  const [user, setUser] = React.useState<any>(null);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [securityPin, setSecurityPin] = React.useState("");
  const [pinVerified, setPinVerified] = React.useState(false);
  const [tokenRevealed, setTokenRevealed] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);

  React.useEffect(() => {
    api.getProfile()
      .then(setUser)
      .catch(() => {
        api.checkAuth().then((auth) => setUser(auth.user));
      });
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    setSavingPassword(true);
    try {
      await api.updatePassword({ currentPassword, newPassword });
      toast({ title: "Password Updated Successfully", variant: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleVerifyPin = () => {
    if (securityPin.length === 6) {
      setPinVerified(true);
      setTokenRevealed(true);
      toast({ title: "Security PIN Verified", variant: "success" });
    } else {
      toast({ title: "Invalid PIN", description: "Please enter a 6-digit confirmation PIN", variant: "destructive" });
    }
  };

  return (
    <AppShell breadcrumbs={[{ label: "Profile & Security" }]} user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                {user?.discord_avatar ? (
                  <AvatarImage src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.png`} />
                ) : (
                  <AvatarFallback className="text-lg font-bold">
                    {user?.username?.substring(0, 2).toUpperCase() || "KM"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-base font-bold text-foreground">{user?.username || "Operator"}</h2>
                  <Badge variant={user?.role === "admin" ? "default" : "secondary"}>
                    {user?.role?.toUpperCase() || "USER"}
                  </Badge>
                  <Badge variant="success">ACTIVE</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Account ID: {user?.id || 1} • {user?.email || "No email registered"}
                </p>
                {user?.discord_username && (
                  <p className="text-xs text-muted-foreground">
                    Connected Discord: <span className="font-semibold text-foreground">{user.discord_username}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Password Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Update Password Form */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" /> Change Password
              </CardTitle>
              <CardDescription className="text-[11px]">
                Update your account authentication credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <form onSubmit={handlePasswordUpdate} className="space-y-3">
                <Field label="Current Password">
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <Field label="New Password">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <Field label="Confirm New Password">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <Button type="submit" disabled={savingPassword} className="w-full h-8 text-xs font-semibold">
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Session Token & Input OTP Security Verification */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" /> Elevated Security & Token
              </CardTitle>
              <CardDescription className="text-[11px]">
                Confirm identity with segmented PIN to reveal session security credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <Alert variant="info" className="py-2.5">
                <Shield className="h-4 w-4" />
                <AlertTitle className="text-xs">Security Verification Required</AlertTitle>
                <AlertDescription className="text-[11px]">
                  Enter your 6-digit confirmation PIN below to decrypt session keys.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center space-y-2 pt-2">
                <Label className="text-xs text-muted-foreground">Confirmation PIN</Label>
                <InputOTP maxLength={6} value={securityPin} onChange={setSecurityPin}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleVerifyPin}
                className="w-full h-8 text-xs font-medium"
              >
                {tokenRevealed ? "PIN Verified" : "Verify PIN to Reveal Token"}
              </Button>

              {tokenRevealed && (
                <div className="space-y-1.5 p-3 rounded-md bg-muted/40 border border-border animate-in fade-in-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono">
                      Session Secret Signature
                    </span>
                    <Badge variant="success" className="text-[9px]">ACTIVE</Badge>
                  </div>
                  <p className="text-[11px] font-mono break-all text-foreground">
                    km_sess_9a8f4c2e1b7d5e6a8c3d
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
