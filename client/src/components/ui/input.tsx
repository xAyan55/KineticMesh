import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-1 text-xs text-gray-100 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400/40 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
