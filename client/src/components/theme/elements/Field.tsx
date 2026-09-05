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
          <label className="block text-sm text-gray-300 mb-1.5 font-normal">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="w-5 h-5 text-gray-400 absolute top-3.5 left-3.5 pointer-events-none" />
          )}
          <Input
            ref={ref}
            hasError={!!error}
            className={cn(Icon && "pl-11", className)}
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
