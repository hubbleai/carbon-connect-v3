import React from "react";
import privateChannelIcon from "@assets/svgIcons/privateChannel.svg";
import { Checkbox } from "../design-system/Checkbox";
import { channelInfo } from "./FileSelectionSlack";
import calender from '@assets/svgIcons/calendar.svg'

type propInfo = {
  list: channelInfo;
  isChecked: boolean;
  onSelect: () => void;
};
const FileSystemChannel = ({ list, isChecked, onSelect }: propInfo) => {
  return (
    <div className=" cc-flex cc-p-[16px_0px] cc-w-[361px] cc-border-t cc-border-[#F3F3F4] cc-justify-between">
     <div className="cc-text-[14px] cc-flex cc-items-center cc-leading-[24px] cc-font-semibold cc-text-[#100C20] ">
      <Checkbox
        className="cc-mr-[8px]"
        checked={isChecked}
        onCheckedChange={onSelect}
      />
      {list.name}
      {list.private ? (
        <img className="cc-ml-[8px]" src={privateChannelIcon} alt="icon" />
      ) : null}
    </div>
    <img src={calender} alt="calender" />
   
    </div>
   
  );
};

export default FileSystemChannel;
