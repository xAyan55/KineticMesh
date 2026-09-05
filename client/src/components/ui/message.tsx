import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const messageVariants = cva(
  "flex flex-col gap-1 rounded-md px-2.5 py-1.5 text-xs font-mono transition-colors",
  {
    variants: {
      level: {
        info: "text-foreground bg-transparent",
        warn: "text-amber-400 bg-amber-500/5",
        error: "text-red-400 bg-red-500/10",
        success: "text-emerald-400 bg-emerald-500/5",
        system: "text-muted-foreground italic",
      },
    },
    defaultVariants: {
      level: "info",
    },
  }
);

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  timestamp?: string;
  source?: string;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, level, timestamp, source, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(messageVariants({ level }), className)}
        {...props}
      >
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground select-none">
          {timestamp && <span className="opacity-70">{timestamp}</span>}
          {source && (
            <span className="font-semibold uppercase tracking-wider text-muted-foreground/90">
              [{source}]
            </span>
          )}
        </div>
        <div className="break-all whitespace-pre-wrap leading-relaxed">{children}</div>
      </div>
    );
  }
);
Message.displayName = "Message";

export { Message, messageVariants };
