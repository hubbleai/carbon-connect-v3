import React, { useEffect, useState } from "react";
import SlackLogo from "../../assets/logos/slack.svg";
import { Button } from "@components/common/design-system/Button";
import { useCarbon } from "src/context/CarbonContext";
import { ActiveStep, IntegrationName } from "src/typing/shared";
import AddAccount from "@components/common/AddAccount";
import {
  IntegrationItemType,
  INTEGRATIONS_LIST,
} from "@utils/integrationModalconstants";

import Channel from "@components/common/Slack/Channel";

export type ActiveSlackScreen = "CONNECTED" | "CHANNEL";

const SlackScreen = ({
  setActiveStep,
  activeStepData,
  screen,
  setStartCustomSync,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
  activeStepData?: IntegrationItemType;
  screen: ActiveSlackScreen;
  setStartCustomSync: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [activeScreen, setActiveScreen] = useState(screen);
  const { entryPoint, setSlackActive, slackActive } = useCarbon();
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);

  const handleClick = () => {
    setSlackActive(false);
    setActiveScreen("CHANNEL");
  };

  return (
    <>
      {activeScreen === "CONNECTED" && (
        <div>
          <div className="  cc-p-[32px] md:cc-p-[16px] md:cc-mt-[188px]">
            <img className="cc-w-[50px]" src={SlackLogo} alt="logo" />
            <p className="cc-text-[26px] cc-leading-[40px] cc-font-medium cc-tracking-[-0.26px] cc-text-[#100C20] cc-mt-[24px]  md:cc-mt-[16px] md:cc-text-[20px] md:cc-leading-[32px]">
              Your Slack account is connected.
            </p>
            <p className="cc-text-lg cc-font-semibold cc-text-[#8C8A94] cc-mt-[8px] md:cc-mt-[6px] md:cc-text-[14px] md:cc-leading-[24px]">
              You can select from channels and direct messages to sync with your
              account
            </p>
          </div>
          <div className="cc-p-[32px] md:cc-p-[16px] md:cc-border-none cc-border-t-[1px] cc-border-b-[#F3F3F4] md:cc-fixed md:cc-bottom-[0px] md:cc-left-[0px] md:cc-w-full">
            <Button
              variant="primary"
              className="cc-w-full  cc-text-base cc-h-[48px] cc-font-extrabold"
              onClick={() => handleClick()}
            >
              {openAccounts
                ? "Select more accounts"
                : "Select conversations from Slack"}
            </Button>
            <Button
              onClick={() => {
                if (!entryPoint) setActiveStep("INTEGRATION_LIST");
                else setActiveStep("CONNECT");
                setSlackActive(true);
              }}
              variant="neutral-white-fix"
              size="lg"
              className="cc-w-full cc-mt-[20px]"
            >
              {openAccounts ? "View connected accounts" : "Go back"}
            </Button>
          </div>
        </div>
      )}

      {activeScreen === "CHANNEL" && (
        <>
          <Channel
            setActiveStep={setActiveStep}
            setActive={setActiveScreen}
            openAccount={openAccounts}
            activeScreen={activeScreen}
            activeStepData={INTEGRATIONS_LIST.find(
              (item) => item.id === IntegrationName.SLACK
            )}
            setStartCustomSync={setStartCustomSync}
          />
        </>
      )}
    </>
  );
};

export default SlackScreen;
