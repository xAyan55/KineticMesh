import React, { useEffect, useRef, useState } from "react";
import { TerminalIcon, TrashIcon, ChevronDoubleDownIcon } from "@heroicons/react/outline";

interface ConsoleProps {
  vmId: string | number;
}

export const Console: React.FC<ConsoleProps> = ({ vmId }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/console/${vmId}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setHistory((prev) => [...prev, `\r\n\x1b[32m[KineticMesh] Connected to QEMU Serial Console for VM #${vmId}\x1b[0m\r\n`]);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "output" && msg.data) {
          setHistory((prev) => [...prev, msg.data]);
        }
      } catch (err) {
        setHistory((prev) => [...prev, event.data]);
      }
    };

    ws.onerror = () => {
      setHistory((prev) => [...prev, `\r\n\x1b[31m[KineticMesh] Console connection error.\x1b[0m\r\n`]);
    };

    ws.onclose = () => {
      setConnected(false);
      setHistory((prev) => [...prev, `\r\n\x1b[33m[KineticMesh] Connection closed. (VM may be stopped or suspended)\x1b[0m\r\n`]);
    };

    return () => {
      ws.close();
    };
  }, [vmId]);

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, autoScroll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: "input", data: input + "\n" }));
    setInput("");
  };

  return (
    <div className="bg-gray-700 backdrop rounded-box border border-gray-600/70 overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Console Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600/60 bg-gray-800/80">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-arix" />
          <span className="font-header font-medium text-sm text-gray-100">QEMU Serial Terminal</span>
          <span
            className={`text-xs px-2 py-0.5 rounded font-semibold ml-2 ${
              connected ? "bg-success-200/40 text-success-50 kx-live" : "bg-danger-200/40 text-danger-50"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
              autoScroll ? "bg-gray-600 text-gray-100" : "text-gray-400 hover:text-gray-200"
            }`}
            title="Toggle Auto-Scroll"
          >
            <ChevronDoubleDownIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-Scroll</span>
          </button>
          <button
            onClick={() => setHistory([])}
            className="p-1.5 rounded text-xs text-gray-400 hover:text-danger-50 transition"
            title="Clear Console Output"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div
        ref={terminalRef}
        className="flex-1 bg-gray-900/95 p-4 font-mono text-xs text-gray-200 overflow-y-auto whitespace-pre-wrap select-text leading-relaxed"
      >
        {history.length === 0 ? (
          <div className="text-gray-500 italic">
            Connecting to guest VM serial port... If output does not appear, verify the VM is powered on with a configured serial tty.
          </div>
        ) : (
          history.map((line, idx) => <span key={idx}>{line}</span>)
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex border-t border-gray-700 bg-gray-800/90">
        <div className="flex items-center px-3 font-mono text-xs text-arix select-none font-bold">&gt;</div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!connected}
          placeholder={connected ? "Type a command into serial console and hit enter..." : "Terminal is disconnected"}
          className="w-full bg-transparent p-3 font-mono text-xs text-gray-100 placeholder-gray-500 outline-none"
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className="px-5 bg-secondary-200 border-l border-secondary-100 text-secondary-50 hover:bg-secondary-100 text-xs font-medium disabled:opacity-40 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Console;
