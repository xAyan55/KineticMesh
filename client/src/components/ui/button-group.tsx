import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex rounded-md shadow-xs",
          orientation === "horizontal"
            ? "flex-row [&>button]:rounded-none first:[&>button]:rounded-l-md last:[&>button]:rounded-r-md [&>button:not(:first-child)]:-ml-[1px]"
            : "flex-col [&>button]:rounded-none first:[&>button]:rounded-t-md last:[&>button]:rounded-b-md [&>button:not(:first-child)]:-mt-[1px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
