import React from "react";
import { Checkbox } from "./design-system/Checkbox";
import { MessageInfo } from "./AccountManagement";
import userIcon from "@assets/svgIcons/messageUser.svg";
import calender from "@assets/svgIcons/calendar.svg";
import error from "@assets/svgIcons/error.svg";

import { IntegrationAPIResponse } from "../IntegrationModal";
import { formatDate, getAccountIdentifier } from "../../utils/helper-functions";
import ResyncDropdown from "./ResyncDropdown";

type PropsInfo = {
  account: IntegrationAPIResponse;
  isChecked: boolean;
  onSelect: () => void;
  resyncDataSource: (id: number) => void;
  handleUploadFilesClick: (dataSource?: IntegrationAPIResponse) => void;
  cancelSourceItemsSync: (id?: number) => void;
};

const AccountListItem = ({
  account,
  isChecked,
  onSelect,
  resyncDataSource,
  handleUploadFilesClick,
  cancelSourceItemsSync,
}: PropsInfo) => {
  return (
    <div className=" cc-flex cc-p-[16px_0px] md:cc-w-[100%] tab:cc-w-[100%] cc-w-[360px] cc-border-t cc-border-[#F3F3F4] cc-justify-between dark:cc-border-[#ffffff7a] cc-items-center ">
      <div className="cc-text-[14px] cc-flex cc-items-center cc-leading-[24px] cc-font-semibold cc-text-[#100C20] md:!cc-w-[90%]">
        <Checkbox
          className="cc-mr-[12px]"
          checked={isChecked}
          onCheckedChange={onSelect}
        />
        <div className="cc-flex md:cc-w-full">
          <div className="iconArea cc-flex cc-mr-[8px] cc-items-center">
            <div
              className="cc-p-[2.5px] cc-rounded-[5px] "
              style={{ backgroundColor: "#12d065" }}
            >
              <img src={userIcon} alt="userIcon" />
            </div>
          </div>
          <span className="cc-break-all cc-w-[206px] cc-flex cc-flex-col dark:cc-text-dark-text-white md:!cc-w-[100%]">
            {getAccountIdentifier(account)}
            <span className="cc-text-[#8C8A94] cc-leading-[16px] cc-text-[12px] cc-font-medium">{`Last synced at ${formatDate(
              account.last_synced_at
            )}`}</span>
          </span>
        </div>
      </div>

      <div className="group">
        <ResyncDropdown
          resyncDataSource={resyncDataSource}
          account={account}
          handleUploadFilesClick={handleUploadFilesClick}
          cancelSourceItemsSync={cancelSourceItemsSync}
        />
      </div>
    </div>
  );
};

export default AccountListItem;
