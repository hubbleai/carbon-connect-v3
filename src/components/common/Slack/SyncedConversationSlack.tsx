import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../design-system/Input";

import SearchIcon from "@assets/svgIcons/search-icon.svg";

import ChannelDropdown from "./ChannelDropdown";
import MessageDropdown from "./MessageDropdown";
import FileSelectionSlack from "./FileSelectionSlack";
import { SlackConversations } from "../../Screens/SlackScreen";

type PropsInfo = {
  activeTab: string;
  selectedConversations: string[];
  setSelectedConversations: Dispatch<SetStateAction<string[]>>;
  selectFilesMessage: string[];
  setSelectFilesMessage: Dispatch<SetStateAction<string[]>>;
  conversations: SlackConversations;
};

const SyncedConversationSlack = ({
  activeTab,
  selectedConversations,
  selectFilesMessage,
  setSelectedConversations,
  setSelectFilesMessage,
  conversations,
}: PropsInfo) => {
  const [isOpen, setIsOpen] = useState(false);
  const [channelFilter, setChannelFilter] = useState<string>("All Channels");
  const [messageFilter, setMessageFilter] = useState<string>("Direct Messages");

  function setItem(e: Event) {
    const target = e.target as HTMLDivElement;
    const textContent = target.textContent ?? "unknown";

    if (activeTab === "channels") {
      setChannelFilter(textContent);
      setSelectedConversations([]);
    } else {
      setMessageFilter(textContent);
      setSelectFilesMessage([]);
    }
  }

  const [searchValue, setSearchValue] = useState<string>("");

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </label>
        <div className="cc-flex cc-gap-2 sm:cc-gap-3 md:cc-justify-between">
          {activeTab === "channels" ? (
            <ChannelDropdown
              selectedItem={channelFilter}
              setIsOpen={setIsOpen}
              setItem={setItem}
            />
          ) : (
            <MessageDropdown
              selectedItem={messageFilter}
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
        channelFilter={channelFilter}
        messageFilter={messageFilter}
        activeTab={activeTab}
        selectedConversations={selectedConversations}
        setSelectedConversations={setSelectedConversations}
        selectFilesMessage={selectFilesMessage}
        setSelectFilesMessage={setSelectFilesMessage}
        conversations={conversations}
      />
    </>
  );
};

export default SyncedConversationSlack;
