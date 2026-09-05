import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const markerVariants = cva(
  "relative flex items-center justify-center rounded-full font-mono text-[10px] font-medium ring-4 transition-colors",
  {
    variants: {
      status: {
        default: "bg-muted text-muted-foreground ring-muted/30",
        active: "bg-primary text-primary-foreground ring-primary/20",
        success: "bg-emerald-500 text-black ring-emerald-500/20",
        warning: "bg-amber-500 text-black ring-amber-500/20",
        destructive: "bg-destructive text-destructive-foreground ring-destructive/20",
      },
      size: {
        sm: "h-4 w-4 text-[9px]",
        default: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      status: "default",
      size: "default",
    },
  }
);

export interface MarkerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof markerVariants> {
  label?: string;
  time?: string;
}

const Marker = React.forwardRef<HTMLDivElement, MarkerProps>(
  ({ className, status, size, label, time, children, ...props }, ref) => {
    return (
      <div className="flex items-start gap-2.5" ref={ref} {...props}>
        <div className={cn(markerVariants({ status, size }), className)}>
          {children}
        </div>
        {(label || time) && (
          <div className="flex flex-col">
            {label && <span className="text-xs font-medium text-foreground">{label}</span>}
            {time && <span className="text-[10px] text-muted-foreground font-mono">{time}</span>}
          </div>
        )}
      </div>
    );
  }
);
Marker.displayName = "Marker";

export { Marker, markerVariants };
