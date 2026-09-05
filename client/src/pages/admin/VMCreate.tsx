import * as React from "react";
import {
  Server,
  Layers,
  Cpu,
  Globe,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Disc,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Questionnaire, QuestionnaireContent } from "@/components/ui/questionnaire";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { InputGroup, InputAddon, InputGroupInput } from "@/components/ui/input-group";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function VMCreate() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [cpuModels, setCpuModels] = React.useState<any>({});
  const [dnsProviders, setDnsProviders] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Form State derived from KineticMesh source capabilities
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");
  const [vmName, setVmName] = React.useState("");
  const [cores, setCores] = React.useState<number>(1);
  const [memory, setMemory] = React.useState<number>(1024);
  const [diskSize, setDiskSize] = React.useState<number>(20);
  const [cpuModel, setCpuModel] = React.useState<string>("host");
  const [enableAcpi, setEnableAcpi] = React.useState<boolean>(true);
  const [networkType, setNetworkType] = React.useState<string>("user");
  const [dnsProvider, setDnsProvider] = React.useState<string>("cloudflare");
  const [ownerId, setOwnerId] = React.useState<string>("");
  const [rootPassword, setRootPassword] = React.useState("root123");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    Promise.all([
      api.getOSTemplates().catch(() => []),
      api.getCPUModels().catch(() => ({})),
      api.getDNSProviders().catch(() => []),
      api.getAdminUsers().catch(() => []),
    ]).then(([tmpl, cpus, dns, usrs]) => {
      setTemplates(tmpl || []);
      setCpuModels(cpus || {});
      setDnsProviders(dns || []);
      setUsers(usrs || []);

      if (tmpl && tmpl.length > 0) {
        setSelectedTemplate(tmpl[0].key || tmpl[0].id || "");
      }
      if (usrs && usrs.length > 0) {
        setOwnerId(String(usrs[0].id));
      }
    });
  }, []);

  const steps = [
    { id: "template", title: "Template", description: "Select base OS" },
    { id: "hardware", title: "Hardware", description: "vCPU & Memory" },
    { id: "network", title: "Network", description: "Interface & DNS" },
    { id: "identity", title: "Identity", description: "Name & Credentials" },
    { id: "review", title: "Review", description: "Final deployment" },
  ];

  const handleDeploy = async () => {
    if (!vmName.trim()) {
      toast({ title: "Name Required", description: "Please enter a VM name.", variant: "destructive" });
      setCurrentStep(3);
      return;
    }

    setLoading(true);
    try {
      await api.createVM({
        name: vmName,
        os_type: selectedTemplate,
        cores,
        memory,
        disk_size: diskSize,
        cpu_model: cpuModel,
        enable_acpi: enableAcpi ? 1 : 0,
        network_type: networkType,
        dns_provider: dnsProvider,
        owner_id: ownerId ? parseInt(ownerId) : undefined,
        root_password: rootPassword,
        description,
      });

      toast({
        title: "Virtual Machine Deployed",
        description: `Instance ${vmName} successfully scheduled on hypervisor.`,
        variant: "success",
      });

      window.location.href = "/admin/vms";
    } catch (err: any) {
      toast({
        title: "Deployment Failed",
        description: err.message || "Failed to provision VM",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        { label: "Deploy Instance" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Deploy Virtual Machine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            5-step structured provisioning wizard for KVM & software emulation instances.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Questionnaire
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            >
              {/* Step 0: Template Selection via Carousel */}
              {currentStep === 0 && (
                <QuestionnaireContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Select Operating System Template
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Browse pre-configured images or distributions
                      </p>
                    </div>

                    {templates.length > 0 ? (
                      <div className="px-6 py-2">
                        <Carousel opts={{ align: "start" }} className="w-full">
                          <CarouselContent>
                            {templates.map((tmpl) => {
                              const isSelected = selectedTemplate === (tmpl.key || tmpl.id);
                              return (
                                <CarouselItem
                                  key={tmpl.key || tmpl.id}
                                  className="md:basis-1/3"
                                >
                                  <div
                                    onClick={() => setSelectedTemplate(tmpl.key || tmpl.id)}
                                    className={`cursor-pointer rounded-lg border p-4 transition-all flex flex-col justify-between h-36 ${
                                      isSelected
                                        ? "border-primary bg-accent ring-1 ring-primary"
                                        : "border-border bg-card hover:border-border/80"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <Disc className="h-5 w-5 text-foreground" />
                                      {isSelected && <Badge variant="default">Selected</Badge>}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-xs truncate text-foreground">
                                        {tmpl.name || tmpl.template_name || tmpl.key}
                                      </h4>
                                      <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                                        {tmpl.description || "Official cloud image distribution"}
                                      </p>
                                    </div>
                                  </div>
                                </CarouselItem>
                              );
                            })}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                    ) : (
                      <div className="p-4 rounded-md border border-border bg-muted/40 text-xs text-muted-foreground">
                        Loading available templates...
                      </div>
                    )}

                    {/* Mobile Native Select Fallback */}
                    <div className="block sm:hidden space-y-1.5 pt-2">
                      <Label>Or Select via Dropdown</Label>
                      <NativeSelect
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                      >
                        {templates.map((t) => (
                          <option key={t.key || t.id} value={t.key || t.id}>
                            {t.name || t.key}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>
                  </div>
                </QuestionnaireContent>
              )}

              {/* Step 1: Hardware Specifications */}
              {currentStep === 1 && (
                <QuestionnaireContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Compute & Memory Resources
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Configure vCPU threads, physical host RAM bounds, and CPU model
                      </p>
                    </div>

                    {/* vCPU Slider */}
                    <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                      <div className="flex justify-between items-center text-xs">
                        <Label>vCPU Allocation</Label>
                        <span className="font-mono font-bold text-foreground">{cores} Cores</span>
                      </div>
                      <Slider
                        min={1}
                        max={16}
                        step={1}
                        value={[cores]}
                        onValueChange={(val) => setCores(val[0])}
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>1 Core</span>
                        <span>8 Cores</span>
                        <span>16 Cores</span>
                      </div>
                    </div>

                    {/* Memory Slider */}
                    <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                      <div className="flex justify-between items-center text-xs">
                        <Label>Allocated RAM</Label>
                        <span className="font-mono font-bold text-foreground">
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
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>512 MB</span>
                        <span>16 GB</span>
                        <span>32 GB</span>
                      </div>
                    </div>

                    {/* Disk Size Input Group */}
                    <Field label="Disk Image Size (GB)">
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          min={10}
                          max={500}
                          value={diskSize}
                          onChange={(e) => setDiskSize(parseInt(e.target.value) || 20)}
                        />
                        <InputAddon>GB QCOW2</InputAddon>
                      </InputGroup>
                    </Field>

                    {/* CPU Model Architecture Combobox */}
                    {cpuOptions.length > 0 && (
                      <Field label="CPU Model Architecture">
                        <Combobox
                          options={cpuOptions}
                          value={cpuModel}
                          onChange={setCpuModel}
                          placeholder="Select CPU model..."
                        />
                      </Field>
                    )}

                    {/* ACPI Support Checkbox */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="enable_acpi"
                        checked={enableAcpi}
                        onCheckedChange={(checked) => setEnableAcpi(!!checked)}
                      />
                      <Label htmlFor="enable_acpi" className="cursor-pointer text-xs">
                        Enable ACPI Hardware Power Management
                      </Label>
                    </div>
                  </div>
                </QuestionnaireContent>
              )}

              {/* Step 2: Network Configuration */}
              {currentStep === 2 && (
                <QuestionnaireContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Network Interface & DNS
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Choose network stack virtualization and resolver defaults
                      </p>
                    </div>

                    {/* Radio Group Network Type */}
                    <Field label="Virtual Network Backend">
                      <RadioGroup
                        value={networkType}
                        onValueChange={setNetworkType}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1"
                      >
                        <div
                          onClick={() => setNetworkType("user")}
                          className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            networkType === "user"
                              ? "border-primary bg-accent"
                              : "border-border bg-card"
                          }`}
                        >
                          <RadioGroupItem value="user" id="r_user" className="mt-0.5" />
                          <div className="space-y-0.5">
                            <Label htmlFor="r_user" className="cursor-pointer font-semibold">
                              User NAT (Default)
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                              Internal isolated subnet with automatic SSH port forwarding
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={() => setNetworkType("bridge")}
                          className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            networkType === "bridge"
                              ? "border-primary bg-accent"
                              : "border-border bg-card"
                          }`}
                        >
                          <RadioGroupItem value="bridge" id="r_bridge" className="mt-0.5" />
                          <div className="space-y-0.5">
                            <Label htmlFor="r_bridge" className="cursor-pointer font-semibold">
                              Bridged Interface
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                              Direct L2 broadcast domain attachment to host bridge device
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </Field>

                    {/* DNS Provider Select */}
                    {dnsProviders.length > 0 && (
                      <Field label="DNS Resolver Provider">
                        <Select value={dnsProvider} onValueChange={setDnsProvider}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select DNS provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {dnsProviders.map((d) => (
                              <SelectItem key={d.id || d.name} value={d.id || d.name}>
                                {d.name} ({d.primary || d.servers?.[0]})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </div>
                </QuestionnaireContent>
              )}

              {/* Step 3: Identity & Credentials */}
              {currentStep === 3 && (
                <QuestionnaireContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Instance Identity & Ownership
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Set hostname, root access credentials, and user ownership
                      </p>
                    </div>

                    <Field label="Virtual Machine Name" required>
                      <Input
                        value={vmName}
                        onChange={(e) => setVmName(e.target.value)}
                        placeholder="e.g. production-database-node"
                        className="h-8 text-xs font-mono"
                      />
                    </Field>

                    <Field label="Root Access Password">
                      <Input
                        type="password"
                        value={rootPassword}
                        onChange={(e) => setRootPassword(e.target.value)}
                        placeholder="root123"
                        className="h-8 text-xs font-mono"
                      />
                    </Field>

                    {users.length > 0 && (
                      <Field label="Assigned Account Owner">
                        <Select value={ownerId} onValueChange={setOwnerId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((u) => (
                              <SelectItem key={u.id} value={String(u.id)}>
                                {u.username} ({u.email || u.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}

                    <Field label="Instance Description / Notes">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional administrative deployment notes..."
                        className="min-h-[60px]"
                      />
                    </Field>
                  </div>
                </QuestionnaireContent>
              )}

              {/* Step 4: Review & Deploy */}
              {currentStep === 4 && (
                <QuestionnaireContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Review Deployment Specifications
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Verify configurations before dispatching provisioning job to hypervisor
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="text-[10px] text-muted-foreground">Instance Name</span>
                        <p className="font-semibold text-foreground mt-0.5">{vmName || "Untitled"}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="text-[10px] text-muted-foreground">Base OS Template</span>
                        <p className="font-semibold text-foreground mt-0.5">{selectedTemplate}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="text-[10px] text-muted-foreground">vCPU Cores</span>
                        <p className="font-semibold font-mono text-foreground mt-0.5">{cores} Cores</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="text-[10px] text-muted-foreground">Allocated RAM</span>
                        <p className="font-semibold font-mono text-foreground mt-0.5">{memory} MB</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="text-[10px] text-muted-foreground">Disk Storage</span>
                        <p className="font-semibold font-mono text-foreground mt-0.5">{diskSize} GB</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <span className="text-[10px] text-muted-foreground">Network Subsystem</span>
                        <p className="font-semibold text-foreground mt-0.5 uppercase">{networkType} NAT</p>
                      </div>
                    </div>
                  </div>
                </QuestionnaireContent>
              )}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                    className="gap-1.5"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={loading}
                    onClick={handleDeploy}
                    className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                  >
                    {loading ? <Spinner size="sm" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    <span>{loading ? "Provisioning VM..." : "Deploy Virtual Machine"}</span>
                  </Button>
                )}
              </div>
            </Questionnaire>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
