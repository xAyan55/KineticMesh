import * as React from "react";
import { cn } from "@/lib/utils";

const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "scroll-m-20 text-xl font-bold tracking-tight text-foreground lg:text-2xl",
      className
    )}
    {...props}
  />
));
TypographyH1.displayName = "TypographyH1";

const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "scroll-m-20 text-base font-semibold tracking-tight text-foreground first:mt-0",
      className
    )}
    {...props}
  />
));
TypographyH2.displayName = "TypographyH2";

const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "scroll-m-20 text-sm font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
TypographyH3.displayName = "TypographyH3";

const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs leading-relaxed text-foreground", className)}
    {...props}
  />
));
TypographyP.displayName = "TypographyP";

const TypographyMuted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
TypographyMuted.displayName = "TypographyMuted";

const TypographyCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[11px] font-medium text-foreground",
      className
    )}
    {...props}
  />
));
TypographyCode.displayName = "TypographyCode";

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyMuted,
  TypographyCode,
};
