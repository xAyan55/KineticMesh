import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-8 w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-1 text-xs text-gray-100 shadow-xs transition-colors focus-visible:outline-none focus-visible:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400/40 disabled:cursor-not-allowed disabled:opacity-50 pr-8",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50" />
      </div>
    );
  }
);
NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
