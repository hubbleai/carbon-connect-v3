import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import SyncedConversationSlack from "./SyncedConversationSlack";
import { DialogFooter } from "../design-system/Dialog";
import { Button } from "../design-system/Button";
import Sync from "./Sync";
import SuccessScreenSlack from "./SuccessScreenSlack";
import CarbonContext from "src/context/CarbonContext";

type PropsInfo = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

const SlackTab = ({ activeTab, setActiveTab }: PropsInfo) => {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [selectFilesMessage, setSelectFilesMessage] = useState<number[]>([]);
  const [step, setStep] = useState<number>(1);
  const { setSlackActive, slackActive } = useContext(CarbonContext);
  const tabValues = [
    {
      tab: "channels",
      text: "Channels",
    },
    { tab: "messages", text: "Messages" },
  ];

  // useEffect(() => {

  //   setTimeout(()=>{
  //     if(step ===2){
  //       setStep(3)
  //      setSlackActive(true)
  //     }
  //   }, 2000)
  // }, [activeTab , step]);

  return (
    <>
      {step === 1 && (
        <div className="cc-p-[16px]">
          <div className="cc-flex cc-gap-[16px]  ">
            {tabValues.map((item) => {
              return (
                <div className="cc-w-[368px]">
                  <label
                    key={item.tab}
                    className={`cc-flex cc-w-full cc-justify-between cc-items-center cc-cursor-pointer cc-border cc-rounded-xl cc-px-3 cc-py-3 
                     ${
                       activeTab === item.tab
                         ? "cc-border-surface-info_main"
                         : "cc-border-surface-surface_3 dark:cc-border-[#FFFFFF1F]"
                     }
                `}
                  >
                    <input
                      type="radio"
                      name="tab"
                      checked={activeTab === item.tab}
                      onChange={() => {
                        setActiveTab(item.tab);
                      }}
                      className="cc-hidden"
                    />
                    <span
                      className={`cc-custom-radio cc-text-sm cc-font-semibold cc-text-high_em dark:cc-text-dark-text-white dark:before:cc-border-dark-text-gray  ${
                        activeTab === item.tab ? "cc-custom-radio-checked " : ""
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
          <SyncedConversationSlack
            activeTab={activeTab}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectFilesMessage={selectFilesMessage}
            setSelectFilesMessage={setSelectFilesMessage}
          />

          {selectedFiles.length > 0 || selectFilesMessage.length > 0 ? (
            <DialogFooter className="cc-fixed cc-bottom-[0px] cc-w-[100%] cc-left-[0px]">
              <Button
                size="md"
                className="cc-w-full"
                onClick={() => setStep(2)}
              >
                Sync{" "}
                {selectedFiles.length > 0 && `${selectedFiles.length} Channel`}{" "}
                {selectFilesMessage.length > 0 &&
                  `${
                    selectFilesMessage.length > 0 && selectedFiles.length > 0
                      ? "&"
                      : ""
                  } ${selectFilesMessage.length} Messages`}
              </Button>
            </DialogFooter>
          ) : null}
        </div>
      )}
      {step === 2 && (
        <Sync
          selectedFiles={selectedFiles}
          selectFilesMessage={selectFilesMessage}
        />
      )}
      {step === 3 && (
        <SuccessScreenSlack
          setStep={setStep}
          setSelectedFiles={setSelectedFiles}
          setSelectFilesMessage={setSelectFilesMessage}
        />
      )}
    </>
  );
};

export default SlackTab;