import * as React from "react";
import { Server, Save, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Combobox } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function VMEdit({ vmId }: { vmId: string | number }) {
  const [vm, setVM] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [cpuModels, setCpuModels] = React.useState<any>({});

  // Editable fields
  const [name, setName] = React.useState("");
  const [cores, setCores] = React.useState(1);
  const [memory, setMemory] = React.useState(1024);
  const [cpuModel, setCpuModel] = React.useState("host");
  const [enableAcpi, setEnableAcpi] = React.useState(true);
  const [sshPort, setSshPort] = React.useState(2222);

  React.useEffect(() => {
    Promise.all([
      api.getVM(vmId),
      api.getCPUModels().catch(() => ({})),
    ])
      .then(([vmData, cpus]) => {
        setVM(vmData);
        setCpuModels(cpus || {});
        if (vmData) {
          setName(vmData.name || "");
          setCores(parseInt(vmData.cores) || 1);
          setMemory(parseInt(vmData.memory) || 1024);
          setCpuModel(vmData.cpu_model || "host");
          setEnableAcpi(!!vmData.enable_acpi);
          setSshPort(parseInt(vmData.ssh_port) || 2222);
        }
      })
      .catch((err) => {
        toast({ title: "Failed to load VM", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [vmId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateVM(vmId, {
        name,
        cores,
        memory,
        cpu_model: cpuModel,
        enable_acpi: enableAcpi ? 1 : 0,
        ssh_port: sshPort,
      });
      toast({ title: "Configuration Updated", variant: "success" });
      window.location.href = `/vm/${vmId}`;
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const cpuOptions = Object.entries(cpuModels).map(([key, val]: any) => ({
    value: key,
    label: val.name || key,
    description: val.description || "",
  }));

  return (
    <AppShell
      breadcrumbs={[
        { label: "Admin Virtual Machines", href: "/admin/vms" },
        { label: vm?.name || `VM ${vmId}`, href: `/vm/${vmId}` },
        { label: "Edit Configuration" },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Edit Virtual Machine Configuration
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update hypervisor resource limits and motherboard parameters for instance #{vmId}.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/vm/${vmId}`)}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Cancel</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold">Hardware Allocation</CardTitle>
            <CardDescription className="text-[11px]">
              Modifications take effect on the next machine restart cycle
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <Field label="Instance Name" required>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                {/* vCPU Slider */}
                <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex justify-between items-center text-xs">
                    <Label>vCPU Cores</Label>
                    <span className="font-mono font-bold">{cores} Cores</span>
                  </div>
                  <Slider
                    min={1}
                    max={16}
                    step={1}
                    value={[cores]}
                    onValueChange={(val) => setCores(val[0])}
                  />
                </div>

                {/* Memory Slider */}
                <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex justify-between items-center text-xs">
                    <Label>Allocated RAM</Label>
                    <span className="font-mono font-bold">
                      {memory} MB ({(memory / 1024).toFixed(1)} GB)
                    </span>
                  </div>
                  <Slider
                    min={512}
                    max={32768}
                    step={512}
                    value={[memory]}
                    onValueChange={(val) => setMemory(val[0])}
                  />
                </div>

                {/* CPU Model Combobox */}
                {cpuOptions.length > 0 && (
                  <Field label="Emulated CPU Architecture">
                    <Combobox
                      options={cpuOptions}
                      value={cpuModel}
                      onChange={setCpuModel}
                    />
                  </Field>
                )}

                <Field label="Port Forwarded SSH Port">
                  <Input
                    type="number"
                    value={sshPort}
                    onChange={(e) => setSshPort(parseInt(e.target.value) || 2222)}
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="edit_acpi"
                    checked={enableAcpi}
                    onCheckedChange={(c) => setEnableAcpi(!!c)}
                  />
                  <Label htmlFor="edit_acpi" className="cursor-pointer text-xs">
                    Enable ACPI Power Controls
                  </Label>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={saving} className="w-full h-8 text-xs font-semibold gap-1.5">
                    {saving ? <Spinner size="sm" /> : <Save className="h-3.5 w-3.5" />}
                    <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
