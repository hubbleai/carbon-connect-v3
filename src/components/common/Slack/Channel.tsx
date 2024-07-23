import React, { useContext, useEffect, useState } from "react";
import { DialogHeader } from "@components/common/design-system/Dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import CarbonContext, { useCarbon } from "src/context/CarbonContext";
import { IntegrationItemType } from "@utils/integrationModalconstants";
import { ActiveStep, IntegrationName } from "src/typing/shared";
import { Button } from "../design-system/Button";
import RefreshIcon from "@assets/svgIcons/refresh-icon.svg";
import BackIcon from "@assets/svgIcons/back-icon.svg";
import channelIcon from "@assets/svgIcons/channel.svg";
import messageIcon from "@assets/svgIcons/messages.svg";
import { images } from "@assets/index";
import SlackTab from "./SlackTab";
import AddAccount from "../AddAccount";

const Channel: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  activeStepData?: IntegrationItemType;
  setActive?: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  openAccount:boolean
}> = ({ setActiveStep, activeStepData, setActive, active , openAccount }) => {
  const { entryPoint, processedIntegrations } = useCarbon();
  const { setSlackActive, slackActive } = useContext(CarbonContext);
  const [activeChannel , setActiveChannel] = useState(1);
  const localIntegration = processedIntegrations?.find(
    (int) => int.id == IntegrationName.SLACK
  );
  const [activeTab, setActiveTab] = useState<string>("channels");


  if (!localIntegration) return null;
  const tabValues = [
    {
      id: 1,
      name: "Channels",
      messagePrimary: "5 Public Channels",
      messageSecondary: "4 Private Channels found",
      icon: channelIcon,
    },
    {
      id: 2,
      name: "Messages",
      messagePrimary: "4 Direct Messages",
      messageSecondary: "4 Private Channels found",
      icon: messageIcon,
    },
  ];


  return (
    <>
    {
      !slackActive && (
        <DialogHeader closeButtonClass="cc-hidden sm:cc-flex">
        <div className="cc-flex-grow cc-flex cc-gap-3 cc-items-center">
          <button
            className="cc-pr-1 cc-h-10 cc-w-auto cc-shrink-0 "
            onClick={() => {
              if (!entryPoint) setActiveStep("INTEGRATION_LIST");
              else setActiveStep("CONNECT");
              setSlackActive(true);
            }}
          >
            <img
              src={BackIcon}
              alt="Lock"
              className="cc-h-[18px] cc-w-[18px] dark:cc-invert-[1] dark:cc-hue-rotate-180"
            />
          </button>
          <div className=" dark:cc-bg-custom-gradient-dark cc-h-8 cc-w-8 sm:cc-h-14 sm:cc-w-14 cc-shrink-0 cc-bg-surface-white cc-rounded-lg cc-p-0.5 cc-shadow-e2">
            <div className="cc-h-full cc-w-full dark:cc-bg-[#0000007A] cc-bg-gray-50 cc-flex cc-items-center cc-justify-center cc-rounded-lg">
              <img
                src={activeStepData?.logo}
                alt={localIntegration.name}
                className="cc-h-4 cc-w-4 sm:cc-h-8 sm:cc-w-8"
              />
            </div>
          </div>
          <DialogTitle className="cc-flex-grow cc-text-left cc-text-xl cc-font-semibold">
            {activeStepData?.name}
          </DialogTitle>
          <>
            <Button
              size="sm"
              variant="gray"
              className="cc-rounded-xl cc-shrink-0 sm:cc-hidden"
            >
              <img
                src={RefreshIcon}
                alt="User Plus"
                className="cc-h-[18px] cc-w-[18px] cc-shrink-0 dark:cc-invert-[1] dark:cc-hue-rotate-180"
              />
            </Button>
          </>
        </div>
      </DialogHeader>
      )
    }
      
      {
        activeChannel === 1 && (
          openAccount? <AddAccount/>:
            <div className="cc-flex cc-flex-col cc-items-center">
            {tabValues.map((item) => (
              <div
                key={item.id}
                className="cc-flex cc-items-center cc-justify-between cc-p-[12px] cc-border cc-border-[#ECECED] cc-rounded-[12px] cc-w-[96.17%] cc-mt-[16px]"
              >
                <div className="cc-flex">
                  <img src={item.icon} alt="icon" />
                  <div className="cc-ml-[12px]">
                    <p className="cc-text-[14px] cc-leading-[24px] cc-font-semibold cc-text-[#100C20]">
                      {item.name}
                    </p>
                    <div className="cc-text-xs cc-font-medium cc-text-[#8C8A94]">
                      <p>{`${item.messagePrimary} &`}</p>
                      <p>{item.messageSecondary}</p>
                    </div>
                  </div>
                </div>
                <img
                  className="cc-cursor-pointer cc-w-[32px] cc-h-[32px]"
                  src={images.solidplusIcon}
                  alt="icon"
                  onClick={()=>{
                    setActiveChannel(2)
                    setActiveTab(item.name.toLowerCase())
                  }}
                />
              </div>
            ))}
          </div>
        )
      }
      {
        activeChannel === 2 && (
            <SlackTab activeTab ={activeTab} setActiveTab={setActiveTab}/>
        )
      }
     
      
    </>
  );
};

export default Channel;
