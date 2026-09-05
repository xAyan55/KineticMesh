import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, label, description, error, required, htmlFor, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1.5", className)} {...props}>
        {label && (
          <div className="flex items-center justify-between">
            <Label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
          </div>
        )}
        {children}
        {description && !error && (
          <p className="text-[11px] text-muted-foreground leading-normal">{description}</p>
        )}
        {error && (
          <p className="text-[11px] font-medium text-destructive leading-normal">{error}</p>
        )}
      </div>
    );
  }
);
Field.displayName = "Field";

export { Field };
