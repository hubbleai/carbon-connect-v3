import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "../design-system/Checkbox";

import FileSystemChannel from "./FileSystemChannel";
import FileSystemMessage from "./FileSystemMessage";
import DatePicker from "./DatePicker";
import { SlackConversations } from "../../Screens/SlackScreen";
import { SlackSyncObject } from "./SlackTab";

type propInfo = {
  channelFilter: string;
  activeTab: string;
  messageFilter: string;
  selectedConversations: string[];
  setSelectedConversations: Dispatch<SetStateAction<string[]>>;
  selectFilesMessage: string[];
  setSelectFilesMessage: Dispatch<SetStateAction<string[]>>;
  conversations: SlackConversations;
  conversationDates: { [id: string]: string };
  setConversationDates: Dispatch<SetStateAction<{ [id: string]: string }>>;
  searchValue: string;
};

export type channelInfo = {
  id: number;
  name: string;
  private: boolean;
};
export type MessageInfo = {
  id: number;
  userBgOne: string;
  userBgTwo: string;
  userBgThree: string;
  userOne: string;
  userTwo: string;
  userThree: string;
  isGroup: boolean;
};

const FileSelectionSlack = ({
  channelFilter,
  activeTab,
  messageFilter,
  selectedConversations,
  setSelectedConversations,
  selectFilesMessage,
  setSelectFilesMessage,
  conversations,
  conversationDates,
  setConversationDates,
  searchValue,
}: propInfo) => {
  const [openAll, setOpenAll] = useState<boolean>(false);
  const [selectedAll, setSelectedAll] = useState<Date | undefined>(undefined);
  const [selectedAllMessage, setSelectedAllMessage] = useState<
    Date | undefined
  >(undefined);

  const activeChannels =
    channelFilter == "All Channels"
      ? [...conversations.publicChannels, ...conversations.privateChannels]
      : channelFilter === "Public Channels"
      ? conversations.publicChannels
      : conversations.privateChannels;
  const filteredChannels = searchValue
    ? activeChannels.filter((channel) =>
        channel.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : activeChannels;

  const activeMessages =
    messageFilter === "Group Messages"
      ? conversations.mpdms
      : conversations.dms;
  const filteredMessages = searchValue
    ? activeMessages.filter((message) =>
        message.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : activeMessages;

  const storeDateAll = (date: string) => {
    const items = activeTab == "channels" ? filteredChannels : filteredMessages;
    const dates = Object.assign({}, conversationDates);
    for (let item of items) {
      dates[item.id] = date;
    }

    setConversationDates(dates);
  };

  return (
    <>
      <div className="cc-flex md:!cc-flex-row cc-flex-col cc-items-center cc-justify-between cc-mt-[40px] sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3 cc-gap-5 sm:cc-gap-3">
        {activeTab === "channels" ? (
          <div>
            {selectedConversations.length > 0 ? (
              <button
                onClick={() => setSelectedConversations([])}
                className="cc-text-sm cc-font-semibold cc-text-outline-danger_high_em cc-items-start cc-text-left"
              >
                Clear selection
              </button>
            ) : (
              <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer dark:cc-text-dark-text-white">
                <Checkbox
                  className="my-0.5"
                  checked={
                    filteredChannels.length
                      ? selectedConversations.length === filteredChannels.length
                      : false
                  }
                  onCheckedChange={() => {
                    const allFilesId = filteredChannels.map((item) => item.id);
                    setSelectedConversations(allFilesId);
                  }}
                />
                Select all
              </label>
            )}
          </div>
        ) : (
          <div>
            {selectFilesMessage.length > 0 ? (
              <button
                onClick={() => setSelectFilesMessage([])}
                className="cc-text-sm cc-font-semibold cc-text-outline-danger_high_em cc-items-start cc-text-left"
              >
                Clear selection
              </button>
            ) : (
              <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer dark:cc-text-dark-text-white">
                <Checkbox
                  className="my-0.5"
                  checked={
                    filteredMessages.length
                      ? selectFilesMessage.length === filteredMessages.length
                      : false
                  }
                  onCheckedChange={() => {
                    const allFilesId = filteredMessages.map((item) => item.id);
                    setSelectFilesMessage(allFilesId);
                  }}
                />
                Select all
              </label>
            )}
          </div>
        )}

        <div
          className="cc-p-[4px_8px] cc-text-[10px] cc-leading-[16px] cc-font-bold cc-text-[#100C20] cc-border cc-border-[#ECECED] cc-rounded-[6px] cc-cursor-pointer dark:cc-text-dark-text-white dark:hover:cc-bg-[#464646]"
          onClick={() => {
            setOpenAll(true);
          }}
        >
          Set start date for all
        </div>
        {openAll && (
          <DatePicker
            setOpen={setOpenAll}
            selected={
              activeTab === "channels" ? selectedAll : selectedAllMessage
            }
            setSelected={
              activeTab === "channels" ? setSelectedAll : setSelectedAllMessage
            }
            setStoreDate={storeDateAll}
          />
        )}
      </div>

      <div className="cc-flex cc-flex-wrap cc-gap-x-[28px]  ">
        {activeTab === "channels"
          ? filteredChannels.map((item) => {
              const isChecked = selectedConversations.indexOf(item.id) >= 0;
              return (
                <FileSystemChannel
                  isChecked={isChecked}
                  item={item}
                  onSelect={() => {
                    setSelectedConversations((prev) => {
                      if (isChecked) {
                        return prev.filter((id) => id !== item.id);
                      } else {
                        return [...prev, item.id];
                      }
                    });
                  }}
                  conversationDates={conversationDates}
                  setConversationDates={setConversationDates}
                />
              );
            })
          : filteredMessages.map((item) => {
              const isChecked = selectFilesMessage.indexOf(item.id) >= 0;

              return (
                <FileSystemMessage
                  isChecked={isChecked}
                  item={item}
                  onSelect={() => {
                    setSelectFilesMessage((prev) => {
                      if (isChecked) {
                        return prev.filter((id) => id !== item.id);
                      } else {
                        return [...prev, item.id];
                      }
                    });
                  }}
                  conversationDates={conversationDates}
                  setConversationDates={setConversationDates}
                />
              );
            })}
      </div>
    </>
  );
};

export default FileSelectionSlack;
