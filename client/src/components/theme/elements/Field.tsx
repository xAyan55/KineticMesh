import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import Input, { InputProps } from "./Input";

export interface FieldProps extends InputProps {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, description, error, icon: Icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs text-gray-300 mb-1.5 font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <Icon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
          <Input
            ref={ref}
            hasError={!!error}
            className={cn(Icon && "pl-10", className)}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1 text-xs text-danger-50 font-medium">{error}</p>
        ) : description ? (
          <p className="mt-1 text-xs text-gray-400">{description}</p>
        ) : null}
      </div>
    );
  }
);
Field.displayName = "Field";

export default Field;
