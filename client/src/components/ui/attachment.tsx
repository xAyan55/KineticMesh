import * as React from "react";
import { Disc, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: string;
  type?: string;
  icon?: "disc" | "file";
  onRemove?: () => void;
  attached?: boolean;
}

const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  ({ className, name, size, type, icon = "disc", onRemove, attached = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-3 rounded-lg border border-border bg-card/60 p-3 text-xs transition-colors hover:border-border/80",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
            {icon === "disc" ? <Disc className="h-4 w-4 text-accent-foreground" /> : <File className="h-4 w-4 text-accent-foreground" />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{name}</p>
            <p className="text-[11px] text-muted-foreground">
              {type ? `${type} • ` : ""}{size || (attached ? "Mounted Media" : "Unmounted")}
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Detach</span>
          </Button>
        )}
      </div>
    );
  }
);
Attachment.displayName = "Attachment";

export { Attachment };
