import React, { useState } from "react";
import SettingsIcon from "@assets/svgIcons/settings-icon.svg";
import DisconnectIcon from "@assets/svgIcons/disconnect-icon.svg";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import { Button } from "@components/common/design-system/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/common/design-system/Dropdown";
import DisconnectModal from "@components/common/DisconnectModal";
import { IntegrationAPIResponse } from "../IntegrationModal";
import { useCarbon } from "src/context/CarbonContext";

export default function SettingsDropdown({
  revokeDataSource,
  isRevokingDataSource,
  resyncDataSource,
  isResyncingDataSource,
}: {
  revokeDataSource: () => Promise<void>;
  isRevokingDataSource: boolean;
  resyncDataSource: () => Promise<void>;
  isResyncingDataSource: boolean;
}) {
  const [showDisconnectModal, setShowDisconnectModal] =
    useState<boolean>(false);
 

  return (
    <>
      <DisconnectModal
        isOpen={showDisconnectModal}
        onOpenChange={setShowDisconnectModal}
        revokeDataSource={revokeDataSource}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="gray"
            className="cc-rounded-xl cc-shrink-0 cc-px-0 cc-w-8"
          >
            <img
              src={SettingsIcon}
              alt="User Plus"
              className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="cc-w-[208px]" >
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                !isRevokingDataSource && setShowDisconnectModal(true);
              }}
              className="hover:cc-bg-surface-surface_1 cc-justify-between dark:cc-text-dark-text-white"
            >
              Disconnect account
              <img
                src={DisconnectIcon}
                alt="Disconnect Icon"
                className="cc-h-[14px] cc-w-[14px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cc-bg-surface-surface_1 cc-justify-between dark:cc-text-dark-text-white"
              onClick={() => !isResyncingDataSource && resyncDataSource()}
            >
              Re-sync account
              <img
                src={RefreshIcon}
                alt="Refresh Icon"
                className="cc-h-[14px] cc-w-[14px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
