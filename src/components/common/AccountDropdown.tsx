import React, { useState } from "react";
import DownChevIcon from "@assets/svgIcons/down-chev-icon.svg";
import AddCircleIcon from "@assets/svgIcons/add-circle-icon.svg";
import UserIcon from "@assets/svgIcons/user-icon.svg";
import { Button } from "@components/common/design-system/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/common/design-system/Dropdown";
import DropboxAccountReady from "@components/common/DropboxAccountReady";

export default function AccountDropdown() {
  const [isDropboxAccountReady, setIsDropboxAccountReady] =
    useState<boolean>(false);

  const commonMenuConponent = () => {
    return (
      <DropdownMenuContent align="end" className="cc-w-[232px]">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cc-border-b cc-border-outline-base_em cc-bg-surface-surface_1">
            <div>
              <p className="cc-text-xs cc-font-semibold cc-text-high_em">
                Kende Attila
              </p>
              <p className="cc-text-xxs cc-text-low_em cc-font-semibold">
                csilvers@verizon.net
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cc-bg-surface-surface_1">
            <div>
              <p className="cc-text-xs cc-font-semibold cc-text-high_em">
                Rámai Ivette
              </p>
              <p className="cc-text-xxs cc-text-low_em cc-font-semibold">
                crowemojo@hotmail.com
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cc-bg-surface-surface_1">
            <div>
              <p className="cc-text-xs cc-font-semibold cc-text-high_em">
                Fekete Csanád
              </p>
              <p className="cc-text-xxs cc-text-low_em cc-font-semibold">
                dowdy@yahoo.com
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setIsDropboxAccountReady(true)}
          className="hover:cc-bg-surface-surface_1"
        >
          <p className="cc-text-xs cc-font-semibold cc-text-info_em cc-flex-grow">
            Add Account
          </p>
          <img
            src={AddCircleIcon}
            alt="Add Circle Icon"
            className="cc-h-[18px] cc-w-[18px]"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    );
  };

  return (
    <>
      <DropboxAccountReady
        isOpen={isDropboxAccountReady}
        onOpenChange={setIsDropboxAccountReady}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="gray"
            className="cc-font-semibold cc-px-0 cc-gap-3 sm:cc-min-w-[180px] cc-rounded-xl sm:cc-hidden cc-shrink-0"
          >
            <img
              src={UserIcon}
              alt="User Icon"
              className="cc-h-[18px] cc-w-[18px] cc-shrink-0"
            />
          </Button>
        </DropdownMenuTrigger>
        {commonMenuConponent()}
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="gray"
            className="cc-font-semibold cc-px-3 cc-gap-3 sm:cc-min-w-[180px] cc-rounded-xl cc-hidden sm:cc-flex cc-shrink-0"
          >
            <span className="cc-flex-grow cc-text-left">Kende Attila</span>
            <img
              src={DownChevIcon}
              alt="Down Chev Icon"
              className="cc-h-[18px] cc-w-[18px] cc-shrink-0"
            />
          </Button>
        </DropdownMenuTrigger>
        {commonMenuConponent()}
      </DropdownMenu>
    </>
  );
}