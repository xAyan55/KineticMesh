import React from "react";
import { cn } from "@/lib/utils";
import { ExclamationIcon, InformationCircleIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

interface AlertProps {
  type?: "warning" | "error" | "info" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type = "info", title, children, className }) => {
  const styles = {
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
    error: "bg-danger-200/40 border-danger-100 text-danger-50",
    info: "bg-gray-700/60 border-gray-600 text-gray-200",
    success: "bg-success-200/40 border-success-100 text-success-50",
  }[type];

  const Icon = {
    warning: ExclamationIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon,
  }[type];

  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-box border backdrop mb-4", styles, className)}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        {title && <h5 className="font-semibold mb-1">{title}</h5>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Alert;
