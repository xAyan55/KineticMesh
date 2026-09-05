import * as React from "react";
import { Key, Wifi, WifiOff, Send, Terminal, Play, Lock, User } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { DirectionProvider } from "@/components/ui/direction";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function SSH({ vmId }: { vmId: string | number }) {
  const [vm, setVM] = React.useState<any>(null);
  const [username, setUsername] = React.useState("root");
  const [password, setPassword] = React.useState("");
  const [connected, setConnected] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);
  const [terminalLines, setTerminalLines] = React.useState<string[]>([]);
  const [inputVal, setInputVal] = React.useState("");

  const wsRef = React.useRef<WebSocket | null>(null);
  const termEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    api.getVM(vmId).then(setVM).catch(() => {});
  }, [vmId]);

  React.useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast({ title: "Password Required", variant: "destructive" });
      return;
    }

    setConnecting(true);
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ssh-terminal`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "connect",
          vmId,
          host: "127.0.0.1",
          port: vm?.ssh_port || 2222,
          username,
          password,
        })
      );
    };

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "connected") {
            setConnected(true);
            setConnecting(false);
            setTerminalLines((prev) => [
              ...prev,
              `✓ SSH Connection established to ${username}@127.0.0.1:${vm?.ssh_port || 2222}`,
            ]);
          } else if (msg.type === "error") {
            setConnecting(false);
            setConnected(false);
            toast({ title: "SSH Error", description: msg.message, variant: "destructive" });
            setTerminalLines((prev) => [...prev, `✗ Error: ${msg.message}`]);
          } else if (msg.type === "closed") {
            setConnected(false);
            setConnecting(false);
            setTerminalLines((prev) => [...prev, "Connection closed."]);
          }
        } catch {
          setTerminalLines((prev) => [...prev, event.data]);
        }
      } else {
        // Binary blob/arraybuffer
        const reader = new FileReader();
        reader.onload = () => {
          const text = String(reader.result).replace(/\x1b\[[0-9;]*m/g, "");
          setTerminalLines((prev) => [...prev, text]);
        };
        reader.readAsText(event.data);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setConnecting(false);
      setTerminalLines((prev) => [...prev, "SSH session ended."]);
    };

    ws.onerror = () => {
      setConnected(false);
      setConnecting(false);
      toast({ title: "WebSocket Connection Error", variant: "destructive" });
    };
  };

  const handleSendInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "input", data: inputVal + "\n" }));
    setTerminalLines((prev) => [...prev, `$ ${inputVal}`]);
    setInputVal("");
  };

  const handleDisconnect = () => {
    wsRef.current?.close();
    setConnected(false);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Virtual Machines", href: "/vms" },
        { label: vm?.name || `VM ${vmId}`, href: `/vm/${vmId}` },
        { label: "Web SSH" },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-foreground" />
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Web SSH Terminal: {vm?.name || `VM ${vmId}`}
            </h1>
            <Badge variant={connected ? "success" : "stopped"} className="font-mono text-[10px]">
              {connected ? "SESSION ACTIVE" : "DISCONNECTED"}
            </Badge>
          </div>
          {connected && (
            <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-xs text-destructive">
              Disconnect
            </Button>
          )}
        </div>

        {!connected ? (
          /* Connection Configuration Card */
          <Card className="max-w-md mx-auto">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Establish SSH Session</CardTitle>
              <CardDescription className="text-xs">
                Connect via internal SSH proxy to port {vm?.ssh_port || 2222}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <form onSubmit={handleConnect} className="space-y-3">
                <Field label="SSH Username">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="root"
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <Field label="SSH Password">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-8 text-xs font-mono"
                  />
                </Field>

                <Button type="submit" disabled={connecting} className="w-full h-8 text-xs font-semibold gap-1.5">
                  {connecting ? <Spinner size="sm" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{connecting ? "Negotiating SSH Handshake..." : "Connect Terminal"}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Live Terminal Session */
          <div className="rounded-lg border border-border bg-black/95 p-3 flex flex-col h-[520px] font-mono">
            <DirectionProvider dir="ltr">
              <div className="flex-1 overflow-y-auto space-y-1 text-xs text-emerald-400 p-2">
                {terminalLines.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap break-all leading-relaxed">
                    {line}
                  </div>
                ))}
                <div ref={termEndRef} />
              </div>
            </DirectionProvider>

            <form onSubmit={handleSendInput} className="flex items-center gap-2 pt-2 border-t border-zinc-800">
              <span className="text-xs text-muted-foreground">$</span>
              <Input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type command..."
                className="h-7 text-xs font-mono bg-zinc-900 border-zinc-700 text-white"
                autoFocus
              />
              <Button type="submit" size="sm" className="h-7 text-xs gap-1">
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
