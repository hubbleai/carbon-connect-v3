import React, { Dispatch, SetStateAction} from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../design-system/Dropdown";
import DownChevIcon from "@assets/svgIcons/down-chev-icon.svg";

type PropsInfo ={
    setItem:(e:Event)=> void
    setIsOpen:Dispatch<SetStateAction<boolean>>
    selectedItem:string
}

const ChannelDropdown = ({setItem , setIsOpen , selectedItem}:PropsInfo) => {
 
  return (
    <div className="cc-p-[8px]  cc-rounded-[8px]">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="cc-flex cc-items-center ">
          <p className="cc-text-xs cc-font-semibold cc-text-[#494656] dark:cc-text-dark-text-white">
            {selectedItem}
          </p>

          <img
            src={DownChevIcon}
            alt="Down Chev Icon"
            className="cc-h-[14px] cc-w-[14px] cc-ml-[6px] cc-shrink-0 dark:cc-hue-rotate-180 dark:cc-invert-[1]"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="cc-p-[8px_0px] ">
          <DropdownMenuItem onSelect={setItem} className="cc-text-xs cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white hover:cc-bg-surface-surface_1">All Channels</DropdownMenuItem>

          <DropdownMenuItem onSelect={setItem} className="cc-text-xs cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white hover:cc-bg-surface-surface_1">Public Channels</DropdownMenuItem>
          <DropdownMenuItem onSelect={setItem} className="cc-text-xs cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white hover:cc-bg-surface-surface_1">
            Private Channels
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChannelDropdown;
