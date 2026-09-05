import * as React from "react";
import { Layers, Plus, Trash2, RefreshCw, Disc, HardDrive } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Attachment } from "@/components/ui/attachment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function TemplateManagement() {
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [addOpen, setAddOpen] = React.useState(false);
  const [clearCacheOpen, setClearCacheOpen] = React.useState(false);
  const [clearing, setClearing] = React.useState(false);

  // New template form
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [osType, setOsType] = React.useState("linux");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const loadTemplates = async () => {
    try {
      const data = await api.getAdminTemplates();
      setTemplates(data || []);
    } catch (err: any) {
      toast({ title: "Failed to load templates", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) {
      toast({ title: "Name and Download URL required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      await api.createAdminTemplate({
        name,
        url,
        os_type: osType,
        description,
      });
      toast({ title: "Template Added", variant: "success" });
      setAddOpen(false);
      setName("");
      setUrl("");
      setDescription("");
      loadTemplates();
    } catch (err: any) {
      toast({ title: "Failed to add template", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await api.clearTemplateCache();
      toast({ title: "Template Cache Cleared", variant: "success" });
      setClearCacheOpen(false);
      loadTemplates();
    } catch (err: any) {
      toast({ title: "Clear Failed", description: err.message, variant: "destructive" });
    } finally {
      setClearing(false);
    }
  };

  return (
    <AppShell breadcrumbs={[{ label: "OS Templates & Images" }]}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              OS Templates & Images
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage operating system distributions, cloud-init base images, and download caches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearCacheOpen(true)}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Clear Cache</span>
            </Button>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Template</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register OS Template</DialogTitle>
                  <DialogDescription>
                    Provide remote QCOW2 or raw disk image URL for provisioning
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddTemplate} className="space-y-3 pt-2">
                  <Field label="Template Display Name" required>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Debian 12 Minimal Cloud"
                      className="h-8 text-xs"
                    />
                  </Field>

                  <Field label="Image Download URL" required>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-generic-amd64.qcow2"
                      className="h-8 text-xs font-mono"
                    />
                  </Field>

                  <Field label="Description">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Template architecture, default user, and packages..."
                      className="min-h-[60px]"
                    />
                  </Field>

                  <DialogFooter className="pt-2">
                    <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Registering..." : "Add Template"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Templates Table */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold">Available Templates</CardTitle>
            <CardDescription className="text-[11px]">
              Distributions configured in local storage and cloud repository
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {loading ? (
              <div className="space-y-2 py-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : templates.length === 0 ? (
              <Empty
                icon={<Layers className="h-5 w-5" />}
                title="No Custom Templates Registered"
                description="Use the button above to register external QCOW2 cloud image templates."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Specs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((t, idx) => (
                    <TableRow key={t.id || t.key || idx}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Disc className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="font-semibold text-xs text-foreground">
                              {t.name || t.template_name || t.key}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 font-mono">
                              {t.download_url || t.url || "Built-in Hypervisor Image"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {t.is_builtin ? "BUILT-IN" : "CUSTOM"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">READY</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">
                        {t.disk_size ? `${t.disk_size} GB Disk` : "Dynamic"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Clear Cache Alert Dialog */}
        <AlertDialog open={clearCacheOpen} onOpenChange={setClearCacheOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Template Image Cache?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete downloaded local image cache files from the host server.
                Any subsequent VM creations will re-download the required template files.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={clearing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearCache} disabled={clearing}>
                {clearing ? "Clearing..." : "Clear Cache"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
