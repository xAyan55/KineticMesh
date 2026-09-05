import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bubbleVariants = cva(
  "relative max-w-[85%] rounded-lg px-3 py-2 text-xs shadow-xs transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground border border-border",
        primary: "bg-primary text-primary-foreground",
        muted: "bg-muted text-muted-foreground",
        destructive: "bg-destructive/15 text-destructive border border-destructive/20",
        terminal: "bg-black text-emerald-400 font-mono border border-zinc-800",
      },
      alignment: {
        start: "self-start rounded-bl-xs",
        end: "self-end rounded-br-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      alignment: "start",
    },
  }
);

export interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {
  time?: string;
  sender?: string;
}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, variant, alignment, time, sender, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(bubbleVariants({ variant, alignment }), className)}
        {...props}
      >
        {sender && (
          <div className="mb-1 text-[10px] font-semibold opacity-75">{sender}</div>
        )}
        <div className="leading-relaxed">{children}</div>
        {time && (
          <div className="mt-1 text-right text-[9px] opacity-60 font-mono">
            {time}
          </div>
        )}
      </div>
    );
  }
);
Bubble.displayName = "Bubble";

export { Bubble, bubbleVariants };
