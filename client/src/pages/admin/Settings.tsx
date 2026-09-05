import * as React from "react";
import { Settings as SettingsIcon, Save, Shield, Globe, Disc, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { InputGroup, InputAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function Settings() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // General Settings
  const [siteName, setSiteName] = React.useState("HKVM Panel");
  const [siteDesc, setSiteDesc] = React.useState("Virtual Machine Management System");
  const [siteIcon, setSiteIcon] = React.useState("https://i.imgur.com/0DmkSi4.png");

  // Discord OAuth Settings
  const [discordEnabled, setDiscordEnabled] = React.useState(false);
  const [discordClientId, setDiscordClientId] = React.useState("");
  const [discordClientSecret, setDiscordClientSecret] = React.useState("");
  const [discordRedirectUri, setDiscordRedirectUri] = React.useState("");
  const [discordGuildId, setDiscordGuildId] = React.useState("");

  React.useEffect(() => {
    Promise.all([
      api.getAdminSettings().catch(() => ({})),
      api.getDiscordSettings().catch(() => ({})),
    ])
      .then(([gen, disc]) => {
        if (gen) {
          if (gen.site_name) setSiteName(gen.site_name);
          if (gen.site_description) setSiteDesc(gen.site_description);
          if (gen.site_icon_url) setSiteIcon(gen.site_icon_url);
        }
        if (disc) {
          setDiscordEnabled(disc.enabled === 1 || disc.enabled === true);
          if (disc.client_id) setDiscordClientId(disc.client_id);
          if (disc.client_secret) setDiscordClientSecret(disc.client_secret);
          if (disc.redirect_uri) setDiscordRedirectUri(disc.redirect_uri);
          if (disc.guild_id) setDiscordGuildId(disc.guild_id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateAdminSettings({
        site_name: siteName,
        site_description: siteDesc,
        site_icon_url: siteIcon,
      });
      toast({ title: "General Settings Saved", variant: "success" });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDiscord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateDiscordSettings({
        enabled: discordEnabled ? 1 : 0,
        client_id: discordClientId,
        client_secret: discordClientSecret,
        redirect_uri: discordRedirectUri,
        guild_id: discordGuildId,
      });
      toast({ title: "Discord OAuth Settings Saved", variant: "success" });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell breadcrumbs={[{ label: "System Settings" }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            System Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure global control plane branding, OAuth providers, and hypervisor defaults.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="general">Branding & General</TabsTrigger>
            <TabsTrigger value="discord">Discord OAuth</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-14rem)] pr-2">
            {/* General Branding Tab */}
            <TabsContent value="general" className="pt-2">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold">General Branding & Details</CardTitle>
                <CardDescription className="text-[11px]">
                  Site titles and logos displayed on login screens and navigation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <form onSubmit={handleSaveGeneral} className="space-y-4">
                  <Field label="Panel Title">
                    <Input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="h-8 text-xs font-medium"
                    />
                  </Field>

                  <Field label="Panel Description">
                    <Input
                      value={siteDesc}
                      onChange={(e) => setSiteDesc(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </Field>

                  <Field label="Logo / Favicon Icon URL">
                    <InputGroup>
                      <InputAddon>Icon URL</InputAddon>
                      <InputGroupInput
                        value={siteIcon}
                        onChange={(e) => setSiteIcon(e.target.value)}
                        placeholder="https://..."
                      />
                    </InputGroup>
                  </Field>

                  <Button type="submit" disabled={saving} className="h-8 text-xs gap-1.5">
                    {saving ? <Spinner size="sm" /> : <Save className="h-3.5 w-3.5" />}
                    <span>Save Changes</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discord OAuth Tab with Switch */}
          <TabsContent value="discord" className="pt-2">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold">Discord OAuth & SSO Configuration</CardTitle>
                <CardDescription className="text-[11px]">
                  Enable single sign-on authentication via Discord Developer Applications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <form onSubmit={handleSaveDiscord} className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-semibold">Enable Discord Authentication</Label>
                      <p className="text-[11px] text-muted-foreground">
                        Allow users to sign in with their linked Discord account
                      </p>
                    </div>
                    <Switch
                      checked={discordEnabled}
                      onCheckedChange={setDiscordEnabled}
                    />
                  </div>

                  <Field label="Discord Client ID">
                    <Input
                      value={discordClientId}
                      onChange={(e) => setDiscordClientId(e.target.value)}
                      placeholder="123456789012345678"
                      className="h-8 text-xs font-mono"
                    />
                  </Field>

                  <Field label="Discord Client Secret">
                    <Input
                      type="password"
                      value={discordClientSecret}
                      onChange={(e) => setDiscordClientSecret(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="h-8 text-xs font-mono"
                    />
                  </Field>

                  <Field label="OAuth Redirect URI">
                    <Input
                      value={discordRedirectUri}
                      onChange={(e) => setDiscordRedirectUri(e.target.value)}
                      placeholder="http://your-domain.com/auth/discord/callback"
                      className="h-8 text-xs font-mono"
                    />
                  </Field>

                  <Field label="Required Guild ID (Optional)">
                    <Input
                      value={discordGuildId}
                      onChange={(e) => setDiscordGuildId(e.target.value)}
                      placeholder="Optional server membership restriction"
                      className="h-8 text-xs font-mono"
                    />
                  </Field>

                  <Button type="submit" disabled={saving} className="h-8 text-xs gap-1.5">
                    {saving ? <Spinner size="sm" /> : <Save className="h-3.5 w-3.5" />}
                    <span>Save Discord Settings</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </AppShell>
  );
}
