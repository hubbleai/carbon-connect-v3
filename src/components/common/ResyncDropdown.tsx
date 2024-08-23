import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/common/design-system/Dropdown";
import { Button } from "@components/common/design-system/Button";
import DropboxAccountReady from "@components/common/DropboxAccountReady";
import AddCircleIconBlack from "@assets/svgIcons/add-circle-icon-black.svg";
import refresh from "@assets/svgIcons/refresh.svg";
import { IntegrationAPIResponse } from "../IntegrationModal";

const ResyncDropdown = ({
  resyncDataSource,
  account,
  handleUploadFilesClick,
}: {
  resyncDataSource: (id: number) => void;
  account: IntegrationAPIResponse;
  handleUploadFilesClick: (account?: IntegrationAPIResponse) => void;
}) => {
  const [isDropboxAccountReady, setIsDropboxAccountReady] =
    useState<boolean>(false);

  const resyncDrop = ["Re-Sync", "Select Files"];
  const commonMenuConponent = () => {
    return (
      <DropdownMenuContent align="end" className="cc-w-[153px] cc-py-[8px] ">
        <DropdownMenuGroup>
          {resyncDrop.map((item) => (
            <DropdownMenuItem
              className="!cc-px-[16px] cc-border-outline-base_em hover:cc-bg-surface-surface_1 dark:cc-border-b-dark-border-color"
              onClick={
                item == "Re-Sync"
                  ? () => resyncDataSource(account.id)
                  : () => handleUploadFilesClick(account)
              }
            >
              <div className="cc-flex cc-justify-between cc-items-center cc-w-full">
                <p className="cc-text-xs cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white">
                  {item}
                </p>
                {item === "Re-Sync" ? (
                  <img
                    className="cc-w-[13px] cc-h-[13px]"
                    src={refresh}
                    alt=""
                  />
                ) : (
                  <img
                    className='cc-w-[13px] cc-h-[13px] dark:cc-invert-[1] dark:cc-hue-rotate-180"'
                    src={AddCircleIconBlack}
                    alt=""
                  />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
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
          <svg
            className="cc-cursor-pointer addIconsvg"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.99995 12.4887L3.83704 7.32583L5.16286 6L8.99995 9.83709L12.837 6L14.1629 7.32583L8.99995 12.4887Z"
              fill="black"
            />
          </svg>
        </DropdownMenuTrigger>
        {commonMenuConponent()}
      </DropdownMenu>
    </>
  );
};

export default ResyncDropdown;
