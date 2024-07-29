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
import { IntegrationAPIResponse } from "../IntegrationModal";

export default function AccountDropdown({
  dataSources,
  selectedDataSource,
  handleAddAccountClick,
  handleAccountChange,
}: {
  dataSources: IntegrationAPIResponse[];
  selectedDataSource: IntegrationAPIResponse | null;
  handleAddAccountClick: () => Promise<void>;
  handleAccountChange: (id: number) => void;
}) {
  const [isDropboxAccountReady, setIsDropboxAccountReady] =
    useState<boolean>(false);

  const getAccountEmail = (dataSource: IntegrationAPIResponse | null) => {
    return (
      dataSource?.data_source_external_id.split("|")[1] ||
      dataSource?.data_source_external_id.split("-")[1]
    );
  };

  const commonMenuConponent = () => {
    return (
      <DropdownMenuContent align="end" className="cc-w-[232px]">
        <DropdownMenuGroup>
          {dataSources.map((dataSource) => {
            return (
              <DropdownMenuItem
                key={dataSource.id}
                className="cc-border-b cc-border-outline-base_em hover:cc-bg-surface-surface_1 dark:cc-border-b-dark-border-color"
                onClick={() => handleAccountChange(dataSource.id)}
              >
                <div>
                  <p className="cc-text-xs cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white">
                    {getAccountEmail(dataSource)}
                  </p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleAddAccountClick()}
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
              className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
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
            <span className="cc-flex-grow cc-text-left dark:cc-text-dark-text-white">
              {getAccountEmail(selectedDataSource)}
            </span>
            <img
              src={DownChevIcon}
              alt="Down Chev Icon"
              className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </Button>
        </DropdownMenuTrigger>
        {commonMenuConponent()}
      </DropdownMenu>
    </>
  );
}
