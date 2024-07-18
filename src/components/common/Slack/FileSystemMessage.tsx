import React from "react";
import { Checkbox } from "../design-system/Checkbox";
import { MessageInfo } from "./FileSelectionSlack";
import userIcon from "@assets/svgIcons/messageUser.svg";
import calender from "@assets/svgIcons/calendar.svg";

type PropsInfo = {
  list: MessageInfo;
  isChecked: boolean;
  onSelect: () => void;
};

const FileSystemMessage = ({ list, isChecked, onSelect }: PropsInfo) => {
  return (
    <div className=" cc-flex cc-p-[16px_0px] cc-w-[361px] cc-border-t cc-border-[#F3F3F4] cc-justify-between">
      <div className="cc-text-[14px] cc-flex cc-items-center cc-leading-[24px] cc-font-semibold cc-text-[#100C20]">
        <Checkbox
          className="cc-mr-[12px]"
          checked={isChecked}
          onCheckedChange={onSelect}
        />
        <div>
          <div className="iconArea cc-flex cc-mr-[8px] cc-items-center">
            <div
              className="cc-p-[2.5px] cc-rounded-[5px] "
              style={{ backgroundColor: list.userBgOne }}
            >
              <img src={userIcon} alt="userIcon" />
            </div>
            {list.isGroup && (
              <>
                <div className="cc-border-[1.5px] cc-border-[#FFF] cc-bg-[#fff] cc-rounded-[5px] cc-ml-[-3px]">
                  <div
                    className="cc-p-[2.5px] cc-rounded-[5px] "
                    style={{ backgroundColor: list.userBgTwo }}
                  >
                    <img src={userIcon} alt="userIcon" />
                  </div>
                </div>

                {list.userBgThree === "" ? null : (
                  <div className="cc-border-[1.5px] cc-border-[#FFF] cc-bg-[#fff] cc-rounded-[5px] cc-ml-[-5px]">
                    <div
                      className="cc-p-[2.5px] cc-rounded-[5px] "
                      style={{ backgroundColor: list.userBgThree }}
                    >
                      <img src={userIcon} alt="userIcon" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <span className="cc-truncate cc-w-[206px]">
          {list.userOne}
          {list.isGroup &&
            `, ${list.userTwo}${
              list.userThree !== "" ? `, ${list.userThree}` : ""
            }`}
        </span>
      </div>
      <img src={calender} alt="calender" />
    </div>
  );
};

export default FileSystemMessage;
