import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@components/common/design-system/Dialog";
import { Button } from "./design-system/Button";
import DisconnectIconWhite from "@assets/svgIcons/disconnect-icon-white.svg";

export default function DisconnectModal({
  isOpen,
  onOpenChange,
  revokeDataSource,
}: {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  revokeDataSource: () => Promise<void>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        activeState={"INTEGRATION_LIST"}
        className="cc-h-auto sm:cc-h-fit sm:cc-max-h-[90vh]  sm:cc-w-[464px] cc-gap-0 sm:cc-rounded-[20px]   cc-rounded-t-2xl  cc-top-1/2 -cc-translate-x-1/2 -cc-translate-y-1/2"
      >
        <div className="cc-p-4 sm:cc-p-8">
          <div className="cc-p-2 cc-rounded-md cc-bg-surface-danger_main cc-inline-block cc-mb-6">
            <img
              src={DisconnectIconWhite}
              alt="Disconnect Icon"
              className="cc-h-6 cc-w-6"
            />
          </div>
          <p className="cc-text-2.5xl cc-font-medium cc-mb-1.5 dark:cc-text-dark-text-white">
            Are you sure want to disconnect you account?
          </p>
          <p className="text-low-em dark:cc-text-dark-text-white">
            If you disconnect your account, you'll have to reconnect to start
            syncing content again.
          </p>
        </div>
        <DialogFooter className="p-4 sm:cc-px-8 sm:cc-pb-8 sm:cc-pt-6">
          <Button
            variant="danger"
            size="lg"
            className="cc-w-full cc-mb-2 sm:cc-mb-5"
            onClick={() => revokeDataSource()}
          >
            Disconnect account
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="neutral-white"
            size="lg"
            className="cc-w-full"
          >
            Go Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
