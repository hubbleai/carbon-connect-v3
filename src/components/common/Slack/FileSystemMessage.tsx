import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "../design-system/Checkbox";
import { MessageInfo } from "./FileSelectionSlack";
import userIcon from "@assets/svgIcons/messageUser.svg";
import calender from "@assets/svgIcons/calendar.svg";
import DatePicker from "./DatePicker";
import calenderUpdate from "@assets/svgIcons/calendarUpdate.svg";
import { SlackConversation } from "../../../typing/shared";

type PropsInfo = {
  item: SlackConversation;
  isChecked: boolean;
  onSelect: () => void;
  conversationDates: { [id: string]: string };
  setConversationDates: Dispatch<SetStateAction<{ [id: string]: string }>>;
};

const FileSystemMessage = ({
  item,
  isChecked,
  onSelect,
  conversationDates,
  setConversationDates,
}: PropsInfo) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const storeDate = (date: string) => {
    const dates = Object.assign({}, conversationDates);
    dates[item.id] = date;
    setConversationDates(dates);
  };

  return (
    <div className=" cc-flex cc-p-[16px_0px] md:cc-w-[100%] tab:cc-w-[100%] cc-w-[361px] cc-items-center cc-border-t cc-border-[#F3F3F4] dark:cc-border-[#ffffff7a] cc-justify-between  dark:hover:cc-bg-[#464646]">
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
              style={{ backgroundColor: "#0ED065" }}
            >
              <img src={userIcon} alt="userIcon" />
            </div>
            {item.is_mpim && (
              <>
                <div className="cc-border-[1.5px] cc-border-[#FFF] cc-bg-[#fff] cc-rounded-[5px] cc-ml-[-3px]">
                  <div
                    className="cc-p-[2.5px] cc-rounded-[5px] "
                    style={{ backgroundColor: "#FF7373" }}
                  >
                    <img src={userIcon} alt="userIcon" />
                  </div>
                </div>

                <div className="cc-border-[1.5px] cc-border-[#FFF] cc-bg-[#fff] cc-rounded-[5px] cc-ml-[-5px]">
                  <div
                    className="cc-p-[2.5px] cc-rounded-[5px] "
                    style={{ backgroundColor: "#FCBF04" }}
                  >
                    <img src={userIcon} alt="userIcon" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <div className="cc-truncate cc-w-[206px] dark:cc-text-dark-text-white">
            {item.name}
          </div>
          <span className="cc-text-[#8C8A94] cc-leading-[16px] cc-text-[12px] cc-font-medium dark:cc-text-dark-text-white">
            {conversationDates[item.id] &&
              `Starting from ${conversationDates[item.id]}`}
          </span>
        </div>
      </div>
      {conversationDates[item.id] ? (
        <img
          src={calenderUpdate}
          className="cc-cursor-pointer"
          onClick={() => setOpen(true)}
          alt="calender"
        />
      ) : (
        <img
          src={calender}
          className="cc-cursor-pointer"
          onClick={() => setOpen(true)}
          alt="calender"
        />
      )}
      {open && (
        <DatePicker
          setOpen={setOpen}
          selected={selected}
          setSelected={setSelected}
          setStoreDate={storeDate}
        />
      )}
    </div>
  );
};

export default FileSystemMessage;
