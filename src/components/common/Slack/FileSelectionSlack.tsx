import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "../design-system/Checkbox";

import FileSystemChannel from "./FileSystemChannel";
import FileSystemMessage from "./FileSystemMessage";
import DatePicker from "./DatePicker";
import { SlackConversations } from "../../Screens/SlackScreen";

type propInfo = {
  channelFilter: string;
  activeTab: string;
  messageFilter: string;
  selectedConversations: string[];
  setSelectedConversations: Dispatch<SetStateAction<string[]>>;
  selectFilesMessage: string[];
  setSelectFilesMessage: Dispatch<SetStateAction<string[]>>;
  conversations: SlackConversations;
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
}: propInfo) => {
  const [openAll, setOpenAll] = useState<boolean>(false);
  const [selectedAll, setSelectedAll] = useState<Date | undefined>(undefined);
  const [storeDateAll, setStoreDateAll] = useState<string | undefined>("");
  const [selectedAllMessage, setSelectedAllMessage] = useState<
    Date | undefined
  >(undefined);
  const [storeDateAllMessage, setStoreDateAllMessage] = useState<
    string | undefined
  >("");
  // const channelNames: channelInfo[] = [
  //   {
  //     id: 1,
  //     name: "#awesome-algorithms",
  //     private: false,
  //   },
  //   {
  //     id: 2,
  //     name: "#awesome-algorithms",
  //     private: false,
  //   },
  //   {
  //     id: 3,
  //     name: "#truth-seeking-group",
  //     private: false,
  //   },
  //   {
  //     id: 4,
  //     name: "#truth-seeking-group",
  //     private: false,
  //   },
  //   {
  //     id: 5,
  //     name: "#refunds-experience",
  //     private: false,
  //   },
  //   {
  //     id: 6,
  //     name: "#war-room",
  //     private: true,
  //   },
  //   {
  //     id: 7,
  //     name: "#design",
  //     private: true,
  //   },
  //   {
  //     id: 8,
  //     name: "#design",
  //     private: false,
  //   },
  // ];

  // const users: MessageInfo[] = [
  //   {
  //     id: 1,
  //     userBgOne: "#BDB5FD",
  //     userOne: "Kende Attila",
  //     userBgTwo: "",
  //     userBgThree: "",
  //     userTwo: "",
  //     userThree: "",
  //     isGroup: false,
  //   },
  //   {
  //     id: 2,
  //     userBgOne: "#0ED065",
  //     userOne: "John Adams",
  //     userBgTwo: "",
  //     userBgThree: "",
  //     userTwo: "",
  //     userThree: "",
  //     isGroup: false,
  //   },
  //   {
  //     id: 3,
  //     userBgOne: "#FF7373",
  //     userOne: "Tim Jones",
  //     userBgTwo: "",
  //     userBgThree: "",
  //     userTwo: "",
  //     userThree: "",
  //     isGroup: false,
  //   },
  //   {
  //     id: 4,
  //     userBgOne: "#FCBF04",
  //     userOne: "Rachel Doe",
  //     userBgTwo: "",
  //     userBgThree: "",
  //     userTwo: "",
  //     userThree: "",
  //     isGroup: false,
  //   },
  //   {
  //     id: 5,
  //     userBgOne: "#4CD2FA",
  //     userBgTwo: "#907EF9",
  //     userBgThree: "",
  //     userOne: "Kende Attila",
  //     userTwo: "Abhinav Sharma",
  //     userThree: "",
  //     isGroup: true,
  //   },
  //   {
  //     id: 6,
  //     userBgOne: "#0ED065",
  //     userBgTwo: "#FF7373",
  //     userBgThree: "#FCBF04",
  //     userOne: "John Adams",
  //     userTwo: "Rachel Doe",
  //     userThree: "Abhinav Sharma",
  //     isGroup: true,
  //   },
  // ];

  const filteredChannels =
    channelFilter == "All Channels"
      ? [...conversations.publicChannels, ...conversations.privateChannels]
      : channelFilter === "Public Channels"
      ? conversations.publicChannels
      : conversations.privateChannels;

  const filteredMessages =
    messageFilter === "Group Messages"
      ? conversations.mpdms
      : conversations.dms;

  useEffect(() => {}, [channelFilter, messageFilter, selectedAll]);
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
            setStoreDate={
              activeTab === "channels"
                ? setStoreDateAll
                : setStoreDateAllMessage
            }
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
                  storeDateAll={storeDateAll}
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
                />
              );
            })
          : filteredMessages.map((item) => {
              const isChecked = selectFilesMessage.indexOf(item.id) >= 0;

              return (
                <FileSystemMessage
                  isChecked={isChecked}
                  storeDateAllMessages={storeDateAllMessage}
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
                />
              );
            })}
      </div>
    </>
  );
};

export default FileSelectionSlack;
