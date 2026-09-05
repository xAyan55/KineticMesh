import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CopyOnClickProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export const CopyOnClick: React.FC<CopyOnClickProps> = ({ text, children, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      try {
        const audio = new Audio("/arix/copy.mp3");
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch (err) {}
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      onClick={handleCopy}
      title={copied ? "Copied!" : "Click to copy"}
      className={cn("cursor-pointer relative group inline-flex items-center", className)}
    >
      {children}
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-600 text-xs px-2 py-0.5 rounded text-gray-100 shadow-md pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in duration-150">
          Copied!
        </span>
      )}
    </div>
  );
};
