import React from 'react'
import { Checkbox } from './design-system/Checkbox';
import { MessageInfo } from './AddAccount';
import userIcon from "@assets/svgIcons/messageUser.svg";
import calender from "@assets/svgIcons/calendar.svg";
import error from '@assets/svgIcons/error.svg';
import refresh from '@assets/svgIcons/refresh.svg';

type PropsInfo = {
  list: MessageInfo;
  isChecked: boolean;
  onSelect: () => void;
};

const FileSystemAccount = ({ list, isChecked, onSelect }: PropsInfo) => {
  return (
    <div className=" cc-flex cc-p-[16px_0px] md:cc-w-[100%] cc-w-[360px] cc-border-t cc-border-[#F3F3F4] cc-justify-between">
    <div className="cc-text-[14px] cc-flex cc-items-center cc-leading-[24px] cc-font-semibold cc-text-[#100C20]">
      <Checkbox
        className="cc-mr-[12px]"
        checked={isChecked}
        onCheckedChange={onSelect}
      />
      <div className='cc-flex'>
        <div className="iconArea cc-flex cc-mr-[8px] cc-items-center">
          <div
            className="cc-p-[2.5px] cc-rounded-[5px] "
            style={{ backgroundColor: list.accountBg }}
          >
            <img src={userIcon} alt="userIcon" />
          </div>
         
        </div>
        <span className="cc-truncate cc-w-[206px] cc-flex cc-flex-col">
        {list.accountName}
        <span className="cc-text-[#8C8A94] cc-leading-[16px] cc-text-[12px] cc-font-medium">{`Connected on ${list.connectOn}`}</span>
       
      </span>
      </div>

     
    </div>
    <img src={list.error? error: refresh} alt="" />
   
  </div>
  )
}

export default FileSystemAccount