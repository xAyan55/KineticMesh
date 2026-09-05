import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, hasError, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "appearance-none outline-none w-full min-w-0 p-3 rounded-component text-sm transition-all duration-150",
        "bg-gray-700/80 border border-gray-600 hover:border-gray-500 text-gray-100 placeholder-gray-400",
        "focus:border-gray-400 focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
        hasError && "border-danger-100 text-danger-50 focus:border-danger-200 focus:ring-danger-100",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export default Input;
