import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Checkbox } from "../design-system/Checkbox";

import FileSystemChannel from "./FileSystemChannel";
import FileSystemMessage from "./FileSystemMessage";

type propInfo = {
  activeChannel: string;
  activeTab: string;
  activeMessage: string;
  selectedFiles: number[];
  setSelectedFiles: Dispatch<SetStateAction<number[]>>;
  selectFilesMessage: number[];
  setSelectFilesMessage: Dispatch<SetStateAction<number[]>>;
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
  activeChannel,
  activeTab,
  activeMessage,
  selectedFiles,
  setSelectedFiles,
  selectFilesMessage,
  setSelectFilesMessage,
}: propInfo) => {
  const channelNames: channelInfo[] = [
    {
      id: 1,
      name: "#awesome-algorithms",
      private: false,
    },
    {
      id: 2,
      name: "#awesome-algorithms",
      private: false,
    },
    {
      id: 3,
      name: "#truth-seeking-group",
      private: false,
    },
    {
      id: 4,
      name: "#truth-seeking-group",
      private: false,
    },
    {
      id: 5,
      name: "#refunds-experience",
      private: false,
    },
    {
      id: 6,
      name: "#war-room",
      private: true,
    },
    {
      id: 7,
      name: "#design",
      private: true,
    },
    {
      id: 8,
      name: "#design",
      private: false,
    },
  ];

  const users: MessageInfo[] = [
    {
      id: 1,
      userBgOne: "#BDB5FD",
      userOne: "Kende Attila",
      userBgTwo: "",
      userBgThree: "",
      userTwo: "",
      userThree: "",
      isGroup: false,
    },
    {
      id: 2,
      userBgOne: "#0ED065",
      userOne: "John Adams",
      userBgTwo: "",
      userBgThree: "",
      userTwo: "",
      userThree: "",
      isGroup: false,
    },
    {
      id: 3,
      userBgOne: "#FF7373",
      userOne: "Tim Jones",
      userBgTwo: "",
      userBgThree: "",
      userTwo: "",
      userThree: "",
      isGroup: false,
    },
    {
      id: 4,
      userBgOne: "#FCBF04",
      userOne: "Rachel Doe",
      userBgTwo: "",
      userBgThree: "",
      userTwo: "",
      userThree: "",
      isGroup: false,
    },
    {
      id: 5,
      userBgOne: "#4CD2FA",
      userBgTwo: "#907EF9",
      userBgThree: "",
      userOne: "Kende Attila",
      userTwo: "Abhinav Sharma",
      userThree: "",
      isGroup: true,
    },
    {
      id: 6,
      userBgOne: "#0ED065",
      userBgTwo: "#FF7373",
      userBgThree: "#FCBF04",
      userOne: "John Adams",
      userTwo: "Rachel Doe",
      userThree: "Abhinav Sharma",
      isGroup: true,
    },
  ];

  const filteredChannel = channelNames.filter((channel) => {
    if (activeChannel === "All Channels") {
      return true;
    } else if (activeChannel === "Public Channels") {
      return !channel.private;
    } else if (activeChannel === "Private Channels") {
      return channel.private;
    }
    return true;
  });

  const filteredMessage = users.filter((user) => {
    if (activeMessage === "Group Messages") {
      return user.isGroup;
    } else {
      return !user.isGroup;
    }
  });

  useEffect(() => {
  
  }, [activeChannel, activeMessage]);
  return (
    <>
      <div className="cc-flex cc-flex-col cc-items-center cc-justify-between cc-mt-[40px] sm:cc-flex-row cc-text-sm cc-font-semibold cc-mb-3 cc-gap-5 sm:cc-gap-3">
        {activeTab === "channels" ? (
          <div>
            {selectedFiles.length > 0 ? (
              <button
                onClick={() => setSelectedFiles([])}
                className="cc-text-sm cc-font-semibold cc-text-outline-danger_high_em cc-items-start cc-text-left"
              >
                Clear selection
              </button>
            ) : (
              <label className="cc-flex cc-gap-2 cc-text-sm cc-font-semibold cc-cursor-pointer dark:cc-text-dark-text-white">
                <Checkbox
                  className="my-0.5"
                  checked={
                    channelNames.length
                      ? selectedFiles.length === channelNames.length
                      : false
                  }
                  onCheckedChange={() => {
                    const allFilesId = filteredChannel.map((item) => item.id);
                    setSelectedFiles(allFilesId);
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
                    users.length
                      ? selectFilesMessage.length === users.length
                      : false
                  }
                  onCheckedChange={() => {
                    const allFilesId = filteredMessage.map((item) => item.id);
                    setSelectFilesMessage(allFilesId);
                  }}
                />
                Select all
              </label>
            )}
          </div>
        )}

        <div className="cc-p-[4px_8px] cc-text-[10px] cc-leading-[16px] cc-font-bold cc-text-[#100C20] cc-border cc-border-[#ECECED] cc-rounded-[6px] cc-cursor-pointer">
          Set start date for all
        </div>
      </div>
      <div className="cc-flex cc-flex-wrap cc-gap-x-[28px] ">
        {activeTab === "channels"
          ? filteredChannel.map((item) => {
              const isChecked = selectedFiles.indexOf(item.id) >= 0;
              return (
                <FileSystemChannel
                  isChecked={isChecked}
                  list={item}
                  onSelect={() => {
                    setSelectedFiles((prev) => {
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
          : filteredMessage.map((item) => {
              const isChecked = selectFilesMessage.indexOf(item.id) >= 0;

              return (
                <FileSystemMessage
                  isChecked={isChecked}
                  list={item}
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
