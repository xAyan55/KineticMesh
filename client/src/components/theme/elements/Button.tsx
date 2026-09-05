import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text" | "danger" | "success";
  size?: "small" | "normal" | "large";
  isLoading?: boolean;
}

const ButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "normal", isLoading, className, disabled, ...rest }, ref) => {
    const sizeClasses = {
      small: "px-3 py-1 text-sm h-8 font-normal",
      normal: "px-4 py-2 text-base font-medium",
      large: "px-5 py-3 text-lg font-medium",
    }[size];

    const variantClasses = {
      primary: "bg-arix text-gray-900 font-semibold hover:opacity-95 active:opacity-90",
      secondary: "bg-transparent text-gray-50 border border-gray-500 hover:bg-gray-600",
      text: "bg-secondary-200 text-secondary-50 border border-secondary-100 hover:bg-secondary-100",
      danger: "bg-danger-200 text-danger-50 border border-danger-100 hover:bg-danger-100",
      success: "bg-success-200 text-success-50 border border-success-100 hover:bg-success-100",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-component transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses,
          variantClasses,
          className
        )}
        {...rest}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
ButtonBase.displayName = "ButtonBase";

const TextButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <ButtonBase ref={ref} variant="text" {...props} />
));
TextButton.displayName = "TextButton";

const DangerButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <ButtonBase ref={ref} variant="danger" {...props} />
));
DangerButton.displayName = "DangerButton";

const SuccessButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <ButtonBase ref={ref} variant="success" {...props} />
));
SuccessButton.displayName = "SuccessButton";

export const Button = Object.assign(ButtonBase, {
  Text: TextButton,
  Danger: DangerButton,
  Success: SuccessButton,
});
