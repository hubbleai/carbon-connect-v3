import React from "react";
import { Checkbox } from "./design-system/Checkbox";
import { MessageInfo } from "./AccountManagement";
import userIcon from "@assets/svgIcons/messageUser.svg";
import calender from "@assets/svgIcons/calendar.svg";
import error from "@assets/svgIcons/error.svg";
import refresh from "@assets/svgIcons/refresh.svg";
import { IntegrationAPIResponse } from "../IntegrationModal";
import { formatDate, getAccountIdentifier } from "../../utils/helper-functions";

type PropsInfo = {
  account: IntegrationAPIResponse;
  isChecked: boolean;
  onSelect: () => void;
  resyncDataSource: (id: number) => void;
};

const AccountListItem = ({
  account,
  isChecked,
  onSelect,
  resyncDataSource,
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

      <div className="group" onClick={() => resyncDataSource(account.id)}>
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="refreshSvg"
        >
          <path
            d="M18.0535 7.73867C18.9915 8.96118 19.5 10.4591 19.5 12H21.5C21.5 10.0188 20.8463 8.09295 19.6402 6.52115C18.4341 4.94935 16.7431 3.81945 14.8294 3.30667C12.9157 2.7939 10.8862 2.92691 9.05585 3.68509C8.11318 4.07555 7.25043 4.62059 6.5 5.2918V4H4.5V9H9.5V7H7.60102C8.23635 6.37751 8.98871 5.87768 9.82122 5.53285C11.2449 4.94315 12.8233 4.8397 14.3117 5.23852C15.8002 5.63735 17.1154 6.51616 18.0535 7.73867Z"
            fill="#0BABFB"
          />
          <path
            d="M6.94653 16.2613C6.00846 15.0388 5.5 13.5409 5.5 12H3.5C3.5 13.9812 4.15374 15.9071 5.35982 17.4789C6.5659 19.0507 8.25693 20.1806 10.1706 20.6933C12.0843 21.2061 14.1138 21.0731 15.9442 20.3149C16.8868 19.9245 17.7496 19.3794 18.5 18.7082V20H20.5V15H15.5V17H17.399C16.7636 17.6225 16.0113 18.1223 15.1788 18.4672C13.7551 19.0569 12.1767 19.1603 10.6883 18.7615C9.19983 18.3627 7.88459 17.4838 6.94653 16.2613Z"
            fill="#0BABFB"
          />
        </svg>
      </div>
    </div>
  );
};

export default AccountListItem;
