import React, { useState } from "react";
import { Button } from "../elements/Button";
import { Dialog } from "../elements/Dialog";
import { PlayIcon, RefreshIcon, StopIcon, MinusCircleIcon } from "@heroicons/react/outline";

interface PowerButtonsProps {
  vmId: string | number;
  status: string;
  icons?: boolean;
  className?: string;
  onActionComplete?: () => void;
}

export const PowerButtons: React.FC<PowerButtonsProps> = ({
  vmId,
  status,
  icons = false,
  className = "flex gap-2",
  onActionComplete,
}) => {
  const [confirmKillOpen, setConfirmKillOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const isOffline = status === "stopped" || status === "offline";
  const isStopping = status === "stopping";

  const executeAction = async (action: "start" | "restart" | "stop") => {
    setLoadingAction(action);
    try {
      const res = await fetch(`/api/vms/${vmId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error(`Failed to ${action} VM:`, err);
      }
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error(`Error during ${action}:`, err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className={className}>
      <Dialog.Confirm
        open={confirmKillOpen}
        title="Forcibly Stop VM"
        onClose={() => setConfirmKillOpen(false)}
        confirm="Force Stop"
        onConfirmed={() => {
          setConfirmKillOpen(false);
          executeAction("stop");
        }}
      >
        Forcibly stopping a virtual machine will immediately terminate the QEMU process. Any unsaved data may be lost.
      </Dialog.Confirm>

      <Button.Success
        disabled={!isOffline}
        isLoading={loadingAction === "start"}
        onClick={() => executeAction("start")}
        className={icons ? "!p-2 w-full" : "flex-1"}
        title="Start VM"
      >
        <PlayIcon className="w-4 h-4" />
        {!icons && <span>Start</span>}
      </Button.Success>

      <Button.Text
        disabled={isOffline}
        isLoading={loadingAction === "restart"}
        onClick={() => executeAction("restart")}
        className={icons ? "!p-2 w-full" : "flex-1"}
        title="Restart VM"
      >
        <RefreshIcon className="w-4 h-4" />
        {!icons && <span>Restart</span>}
      </Button.Text>

      <Button.Danger
        disabled={isOffline}
        isLoading={loadingAction === "stop"}
        onClick={() => {
          if (isStopping) {
            setConfirmKillOpen(true);
          } else {
            executeAction("stop");
          }
        }}
        className={icons ? "!p-2 w-full" : "flex-1"}
        title={isStopping ? "Kill VM" : "Stop VM"}
      >
        {isStopping ? <MinusCircleIcon className="w-4 h-4" /> : <StopIcon className="w-4 h-4" />}
        {!icons && <span>{isStopping ? "Kill" : "Stop"}</span>}
      </Button.Danger>
    </div>
  );
};

export default PowerButtons;
