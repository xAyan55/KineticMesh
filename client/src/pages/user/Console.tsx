import * as React from "react";
import {
  Terminal as TerminalIcon,
  Play,
  Square,
  RotateCw,
  Trash2,
  ArrowDown,
  Maximize2,
  Minimize2,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DirectionProvider } from "@/components/ui/direction";
import { Message } from "@/components/ui/message";
import { MessageScroller } from "@/components/ui/message-scroller";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toggle } from "@/components/ui/toggle";
import { Kbd } from "@/components/ui/kbd";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

export function Console({ vmId }: { vmId: string | number }) {
  const [vm, setVM] = React.useState<any>(null);
  const [messages, setMessages] = React.useState<{ id: string; text: string; time: string; level: "info" | "warn" | "error" | "success" | "system" }[]>([]);
  const [inputVal, setInputVal] = React.useState("");
  const [connected, setConnected] = React.useState(false);
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [rawMode, setRawMode] = React.useState(false);

  const wsRef = React.useRef<WebSocket | null>(null);

  const addMessage = (text: string, level: "info" | "warn" | "error" | "success" | "system" = "info") => {
    // Strip ANSI control codes for clean rendering
    const cleanText = text.replace(/\x1b\[[0-9;]*m/g, "");
    if (!cleanText.trim()) return;

    setMessages((prev) => [
      ...prev.slice(-400),
      {
        id: Math.random().toString(36).substring(2, 9),
        text: cleanText,
        time: new Date().toLocaleTimeString(),
        level: cleanText.includes("RUNNING") || cleanText.includes("✓")
          ? "success"
          : cleanText.includes("WARN") || cleanText.includes("⚠")
          ? "warn"
          : cleanText.includes("ERR") || cleanText.includes("✗")
          ? "error"
          : level,
      },
    ]);
  };

  React.useEffect(() => {
    api.getVM(vmId).then(setVM).catch(() => {});

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/console/${vmId}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      addMessage(`Connected to serial console socket for VM ${vmId}`, "system");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "output" && msg.data) {
          const lines = msg.data.split(/\r?\n/);
          for (const line of lines) {
            if (line.trim()) addMessage(line);
          }
        }
      } catch {
        addMessage(event.data);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      addMessage("Serial connection closed.", "warn");
    };

    ws.onerror = () => {
      setConnected(false);
      addMessage("WebSocket error encountered.", "error");
    };

    return () => {
      ws.close();
    };
  }, [vmId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "input", data: inputVal + "\r\n" }));
      addMessage(`> ${inputVal}`, "info");
      setInputVal("");
    } else {
      toast({ title: "Console Not Connected", variant: "destructive" });
    }
  };

  const sendKey = (key: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "input", data: key }));
    }
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Virtual Machines", href: "/vms" },
        { label: vm?.name || `VM ${vmId}`, href: `/vm/${vmId}` },
        { label: "Serial Console" },
      ]}
    >
      <div className="flex h-[calc(100vh-6.5rem)] flex-col space-y-3">
        {/* Top Control Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-4 w-4 text-foreground" />
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Serial Console: {vm?.name || `VM ${vmId}`}
            </h1>
            <Badge variant={connected ? "success" : "destructive"} className="font-mono text-[10px]">
              {connected ? (
                <span className="flex items-center gap-1">
                  <Wifi className="h-2.5 w-2.5" /> ONLINE
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <WifiOff className="h-2.5 w-2.5" /> OFFLINE
                </span>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Toggle
              pressed={autoScroll}
              onPressedChange={setAutoScroll}
              size="sm"
              className="text-[11px] gap-1"
            >
              <ArrowDown className="h-3 w-3" />
              <span>Auto-scroll</span>
            </Toggle>

            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendKey("\x03")}
                className="text-[11px] font-mono h-7"
              >
                ^C
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendKey("\x1b")}
                className="text-[11px] font-mono h-7"
              >
                ESC
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessages([])}
                className="text-[11px] h-7"
              >
                Clear
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* Resizable Work Area */}
        <div className="flex-1 min-h-0 rounded-lg border border-border bg-card overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            {/* Primary Console Stream Panel */}
            <ResizablePanel defaultSize={85} minSize={50}>
              <DirectionProvider dir="ltr">
                <AspectRatio ratio={16 / 9} className="h-full w-full bg-black/95 p-2 font-mono">
                  <MessageScroller autoScroll={autoScroll} className="h-full">
                    {messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-mono">
                        Waiting for serial boot output...
                      </div>
                    ) : (
                      messages.map((m) => (
                        <Message
                          key={m.id}
                          level={m.level}
                          timestamp={m.time}
                          source="TTY"
                        >
                          {m.text}
                        </Message>
                      ))
                    )}
                  </MessageScroller>
                </AspectRatio>
              </DirectionProvider>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Bottom Command Input Bar */}
            <ResizablePanel defaultSize={15} minSize={10}>
              <div className="flex h-full items-center justify-between gap-3 bg-card px-3 py-2">
                <form onSubmit={handleSend} className="flex flex-1 items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">$</span>
                  <Input
                    placeholder="Send command to serial TTY..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="h-8 text-xs font-mono bg-background"
                  />
                  <Button type="submit" size="sm" className="h-8 text-xs gap-1">
                    <Send className="h-3 w-3" />
                    <span>Send</span>
                  </Button>
                </form>

                <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Kbd>Enter</Kbd> send
                  <Kbd>Ctrl+C</Kbd> break
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </AppShell>
  );
}
