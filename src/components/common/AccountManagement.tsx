import React, { useState } from "react";
import { Input } from "./design-system/Input";
import SearchIcon from "@assets/svgIcons/search-icon.svg";
import { Button } from "./design-system/Button";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import AddCircleIconBlack from "@assets/svgIcons/add-circle-icon-black.svg";
import { Checkbox } from "./design-system/Checkbox";
import { UserFileApi } from "src/typing/shared";
import NoResultsIcon from "@assets/svgIcons/no-result.svg";

import Loader from "./Loader";
import { DialogFooter } from "./design-system/Dialog";
import { IntegrationAPIResponse } from "../IntegrationModal";
import AccountListItem from "./AccountListItem";

export type MessageInfo = {
  id: number;
  accountBg: string;
  accountName: string;
  connectOn: string;
  error: boolean;
};

const AccountManagement = ({
  accounts,
  handleAddAccountClick,
  resyncDataSource,
  revokeDataSource,
  performBulkAction,
  performingAction,
  handleUploadFilesClick,
}: {
  accounts: IntegrationAPIResponse[];
  handleAddAccountClick: () => void;
  resyncDataSource: (id?: number, bulk?: boolean) => void;
  revokeDataSource: (id?: number, bulk?: boolean) => void;
  performBulkAction: (ids: number[], message: string, func: Function) => void;
  performingAction: boolean;
  handleUploadFilesClick: (dataSource?: IntegrationAPIResponse) => void;
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

  // const accounts: MessageInfo[] = [
  //   {
  //     id: 1,
  //     accountBg: "#4dd2fa",
  //     accountName: "Carbon",
  //     connectOn: "17/11/2023",
  //     error: true,
  //   },
  //   {
  //     id: 2,
  //     accountBg: "#12d065",
  //     accountName: "Costrings",
  //     connectOn: "17/11/2023",
  //     error: false,
  //   },
  //   {
  //     id: 3,
  //     accountBg: "#12d065",
  //     accountName: "Heeko",
  //     connectOn: "17/11/2023",
  //     error: false,
  //   },
  //   {
  //     id: 4,
  //     accountBg: "#12d065",
  //     accountName: "Hubble",
  //     connectOn: "17/11/2023",
  //     error: true,
  //   },
  // ];

  return (
    <>
      <div className="cc-p-4 cc-min-h-0 cc-flex-grow cc-flex cc-flex-col">
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 cc-mb-[40px] cc-flex-col sm:cc-flex-row">
          <p className="cc-text-xl cc-font-semibold cc-flex-grow dark:cc-text-dark-text-white">
            My Accounts
          </p>
          <div className="cc-flex cc-gap-3 md:cc-gap-[1.75rem]">
            <Button
              size="sm"
              variant="neutral-white"
              className="cc-text-xs !cc-rounded-xl cc-font-semibold cc-shrink-0"
              onClick={() => handleAddAccountClick()}
            >
              <img
                src={AddCircleIconBlack}
                alt="Add Circle Plus"
                className="cc-h-[14px] cc-w-[14px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
              Add Account
            </Button>
          </div>
        </div>
        <div className="cc-flex  cc-flex-col sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3 cc-gap-5 sm:cc-gap-3">
          {selectedAccounts.length > 0 ? (
            <button
              onClick={() => setSelectedAccounts([])}
              className="cc-text-sm cc-font-semibold cc-text-outline-danger_high_em cc-items-start cc-text-left"
            >
              Clear selection
            </button>
          ) : (
            <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer dark:cc-text-dark-text-white">
              <Checkbox
                className="my-0.5"
                checked={
                  accounts.length
                    ? selectedAccounts.length === accounts.length
                    : false
                }
                onCheckedChange={() => {
                  const allAccounts = accounts.map((item) => item.id);
                  setSelectedAccounts(allAccounts);
                }}
              />
              Select all
            </label>
          )}
        </div>
        <div
          id="scrollableTarget"
          className="cc-flex cc-flex-col  cc-overflow-y-auto cc-overflow-x-hidden  sm:cc-mx-0 sm:cc-px-0 cc-flex-grow "
        >
          <div className="cc-flex cc-flex-wrap cc-gap-x-[28px]">
            {accounts.map((item) => {
              const isChecked = selectedAccounts.indexOf(item.id) >= 0;

              return (
                <AccountListItem
                  key={item.id}
                  isChecked={isChecked}
                  account={item}
                  onSelect={() => {
                    setSelectedAccounts((prev) => {
                      if (isChecked) {
                        return prev.filter((id) => id !== item.id);
                      } else {
                        return [...prev, item.id];
                      }
                    });
                  }}
                  resyncDataSource={resyncDataSource}
                  handleUploadFilesClick={handleUploadFilesClick}
                />
              );
            })}
          </div>
        </div>
      </div>
      {selectedAccounts.length > 0 && (
        <DialogFooter className="cc-flex cc-justify-between md:cc-flex-col md:cc-gap-2">
          <Button
            variant="primary"
            size="lg"
            className="cc-w-[68%] md:cc-w-full"
            disabled={performingAction}
            onClick={() =>
              performBulkAction(
                selectedAccounts,
                "Finished queuing data sources for resync",
                resyncDataSource
              )
            }
          >
            Re-sync accounts
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="cc-w-[30%] cc-bg-[#FFE0E0] cc-text-[#F03D3D] md:cc-w-full"
            disabled={performingAction}
            onClick={() =>
              performBulkAction(
                selectedAccounts,
                "Finished revoking your data sources",
                revokeDataSource
              )
            }
          >
            Disconnect accounts
          </Button>
        </DialogFooter>
      )}
    </>
  );
};

export default AccountManagement;
