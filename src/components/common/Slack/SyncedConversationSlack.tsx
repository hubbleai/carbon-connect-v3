import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../design-system/Input";

import SearchIcon from "@assets/svgIcons/search-icon.svg";

import ChannelDropdown from "./ChannelDropdown";
import MessageDropdown from "./MessageDropdown";
import FileSelectionSlack from "./FileSelectionSlack";

type PropsInfo = {
  activeTab: string;
  selectedFiles:number[];
  setSelectedFiles:Dispatch<SetStateAction<number[]>>
  selectFilesMessage:number[];
  setSelectFilesMessage:Dispatch<SetStateAction<number[]>>
};

const SyncedConversationSlack = ({ activeTab , selectedFiles, selectFilesMessage, setSelectedFiles , setSelectFilesMessage }: PropsInfo) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("All Channels");
  const [selectedMessage, setSelectedMessage] =
    useState<string>("Direct Messages");
   

  function setItem(e: Event) {
    const target = e.target as HTMLDivElement;
    const textContent = target.textContent ?? "unknown";
   
   
    if (activeTab === "channels") {
      setSelectedItem(textContent);
      setSelectedFiles([]);
    } else {
      setSelectedMessage(textContent);
      setSelectFilesMessage([]);
    }
  }

  const [serchValue, setSearchValue] = useState<string>("");

  useEffect(() => {}, [selectedItem, activeTab]);
  return (
    <>
      <div className="cc-flex cc-mt-[16px] cc-gap-2 sm:cc-gap-3 cc-mb-3 cc-flex-col cc-justify-between sm:cc-flex-row">
        <label className="cc-relative cc-flex-grow sm:cc-max-w-[350px]">
          <img
            src={SearchIcon}
            alt="Search Icon"
            className="dark:cc-invert-[1] dark:cc-hue-rotate-180 cc-h-4 cc-w-4 cc-absolute cc-top-1/2 cc-transform -cc-translate-y-1/2 cc-left-2 cc-pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search"
            className="cc-h-8 cc-text-xs !cc-pl-7 "
            value={serchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </label>
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 md:cc-justify-between">
          {activeTab === "channels" ? (
            <ChannelDropdown
              selectedItem={selectedItem}
              setIsOpen={setIsOpen}
              setItem={setItem}
            />
          ) : (
            <MessageDropdown
              selectedItem={selectedMessage}
              setIsOpen={setIsOpen}
              setItem={setItem}
            />
          )}

          

          <div className="cc-border cc-border-[#ECECED] cc-rounded-[6px] hover:!cc-bg-surface-surface_3 cc-p-[8px_12px] md:cc-ml-[0px] cc-cursor-pointer cc-text-xs cc-font-bold cc-text-black cc-ml-[16px] dark:cc-text-dark-text-white dark:hover:cc-bg-[#464646]">
            View synced conversations
          </div>
        </div>
      </div>
      <FileSelectionSlack
        activeChannel={selectedItem}
        activeMessage={selectedMessage}
        activeTab={activeTab}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        selectFilesMessage={selectFilesMessage}
        setSelectFilesMessage={setSelectFilesMessage}


      />
    </>
  );
};

export default SyncedConversationSlack;
