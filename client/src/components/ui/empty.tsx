import * as React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 p-8 text-center animate-in fade-in-50",
          className
        )}
        {...props}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-3">
          {icon || <FolderOpen className="h-5 w-5" />}
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);
Empty.displayName = "Empty";

export { Empty };
