import React from "react";
import { Button } from "./Button";
import { XIcon, ExclamationIcon } from "@heroicons/react/outline";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  confirm?: string;
  cancel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}

export const DialogConfirm: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  children,
  confirm = "Continue",
  cancel = "Cancel",
  isDangerous = true,
  isLoading = false,
  onClose,
  onConfirmed,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-gray-800 border border-gray-600 rounded-box max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 p-1 rounded transition"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-danger-200/30 border border-danger-100 flex items-center justify-center text-danger-50 flex-shrink-0">
            <ExclamationIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        </div>
        <div className="text-sm text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <Button.Text onClick={onClose} disabled={isLoading}>
            {cancel}
          </Button.Text>
          {isDangerous ? (
            <Button.Danger onClick={onConfirmed} isLoading={isLoading}>
              {confirm}
            </Button.Danger>
          ) : (
            <Button onClick={onConfirmed} isLoading={isLoading}>
              {confirm}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Dialog = {
  Confirm: DialogConfirm,
};

export default Dialog;
